/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {from as observableFrom , Observable, of as observableOf} from 'rxjs';
import { map, mergeMap, toArray} from 'rxjs/operators';
import { TransactionMapping } from '../core/utils/TransactionMapping';
import { AccountHttp } from '../infrastructure/AccountHttp';
import { AggregateTransaction as AggregatedTransactionCore} from '../infrastructure/builders/AggregateTransaction';
import { MultisigAccountGraphInfo } from '../model/account/MultisigAccountGraphInfo';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { InnerTransaction } from '../model/transaction/InnerTransaction';
import { ModifyMultisigAccountTransaction } from '../model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModificationType } from '../model/transaction/MultisigCosignatoryModificationType';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { TransactionType } from '../model/transaction/TransactionType';
import { CosignatureSignedTransaction, MultisigAccountInfo, PublicAccount } from '../model/model';

/**
 * Aggregated Transaction service
 */
export class AggregateTransactionService {

    /**
     * Constructor
     * @param accountHttp
     */
    constructor(private readonly accountHttp: AccountHttp) {
    }

    /**
     * Check if an aggregate complete transaction has all cosignatories attached
     * @param signedTransaction - The signed aggregate transaction (complete) to be verified
     * @returns {Observable<boolean>}
     */
    public isComplete(signedTransaction: SignedTransaction): Observable<boolean> {
        const aggregateTransaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AggregateTransaction;
        /**
         * Include both initiator & cosigners
         */
        const signers = (aggregateTransaction.cosignatures.map((cosigner) => cosigner.signer.publicKey));
        if (signedTransaction.signer) {
            signers.push(signedTransaction.signer);
        }
        return observableFrom(aggregateTransaction.innerTransactions).pipe(
            mergeMap((innerTransaction: InnerTransaction) => this.accountHttp.getMultisigAccountInfo(innerTransaction.signer.address)
                .pipe(
                    /**
                     * For multisig account, we need to get the graph info in case it has multiple levels
                     */
                    mergeMap((_: MultisigAccountInfo) => _.minApproval !== 0 && _.minRemoval !== 0 ?
                        this.accountHttp.getMultisigAccountGraphInfo(_.account.address)
                        .pipe(
                            map((graphInfo: MultisigAccountGraphInfo) => this.validateCosignatories(graphInfo, signers, innerTransaction)),
                        ) : observableOf(signers.find((s) => s === _.account.publicKey ) !== undefined),
                        ),
                    ),
                ),
            toArray(),
        ).pipe(
            mergeMap((results: boolean[]) => {
                return observableOf(results.every((isComplete) => isComplete));
            }),
        );
    }

    /**
     * Validate cosignatories against multisig Account(s)
     * @param graphInfo - multisig account graph info
     * @param cosignatories - array of cosignatories extracted from aggregated transaction
     * @param innerTransaction - the inner transaction of the aggregated transaction
     * @returns {boolean}
     */
    private validateCosignatories(graphInfo: MultisigAccountGraphInfo,
                                  cosignatories: string[],
                                  innerTransaction: InnerTransaction): boolean {
        /**
         *  Validate cosignatories from bottom level to top
         */
        const sortedKeys = Array.from(graphInfo.multisigAccounts.keys()).sort((a, b) => b - a);
        const cosignatoriesReceived = cosignatories;
        let validationResult = false;

        let isMultisigRemoval = false;

        /**
         * Check inner transaction. If remove cosigner from multisig account,
         * use minRemoval instead of minApproval for cosignatories validation.
         */
        if (innerTransaction.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
            if ((innerTransaction as ModifyMultisigAccountTransaction).modifications
                    .find((modification) => modification.type === MultisigCosignatoryModificationType.Remove) !== undefined) {
                        isMultisigRemoval = true;
            }
        }

        sortedKeys.forEach((key) => {
            const multisigInfo = graphInfo.multisigAccounts.get(key);
            if (multisigInfo && !validationResult) {
                multisigInfo.forEach((multisig) => {
                    if (multisig.minApproval >= 1 && multisig.minRemoval) { // To make sure it is multisig account
                        const matchedCosignatories = this.compareArrays(cosignatoriesReceived,
                                        multisig.cosignatories.map((cosig) => cosig.publicKey));

                        /**
                         * if minimal signature requirement met at current level, push the multisig account
                         * into the received signatories array for next level validation.
                         * Otherwise return validation failed.
                         */
                        if ((matchedCosignatories.length >= multisig.minApproval && !isMultisigRemoval) ||
                            (matchedCosignatories.length >= multisig.minRemoval && isMultisigRemoval)) {
                            if (cosignatoriesReceived.indexOf(multisig.account.publicKey) === -1) {
                                cosignatoriesReceived.push(multisig.account.publicKey);
                              }
                            validationResult = true;
                        } else {
                            validationResult = false;
                        }
                    }
                });
            }
        });

        return validationResult;
    }

    /**
     * Compare two string arrays
     * @param array1 - base array
     * @param array2 - array to be matched
     * @returns {string[]} - array of matched elements
     */
    private compareArrays(array1: string[], array2: string[]): string[] {
        const results: string[] = [];
        array1.forEach((a1) => array2.forEach((a2) => {
            if (a1 === a2) {
                results.push(a1);
            }
        }));

        return results;
    }

    /**
     * Appends cosignatures to a signed aggregate transaction, if they are not yet added
     *
     * @param signedTransaction
     * @param cosignatures
     */
    public static addCosignatures(signedTransaction: SignedTransaction, cosignatures: CosignatureSignedTransaction[]): SignedTransaction {
        // re-create the transaction from payload to determine the type - only allow aggregate complete transaction as an input
        const recreatedSignedTx = TransactionMapping.createFromPayload(signedTransaction.payload);
        if (recreatedSignedTx.type !== TransactionType.AGGREGATE_COMPLETE_V2) {
            throw new Error('Only serialized signed aggregate complete v2 transaction allowed.');
        }
        const recreatedSignedAggregateComplete = recreatedSignedTx as AggregateTransaction;

        const signedTransactionRaw = AggregatedTransactionCore.appendSignatures(
            signedTransaction,
            cosignatures.filter(cosignature => ! recreatedSignedAggregateComplete.signedByAccount(
                    PublicAccount.createFromPublicKey(cosignature.signer, recreatedSignedAggregateComplete.version.networkType))));

        return new SignedTransaction(
            signedTransactionRaw.payload,
            signedTransaction.hash,
            signedTransaction.signer,
            signedTransaction.type,
            signedTransaction.networkType
        );
    }

    /**
     * Appends cosignatures to a signed aggregate transaction, if they are not yet added
     *
     * @param signedTransaction
     * @param cosignatures
     */
    public static addCosignaturesV1(signedTransaction: SignedTransaction, cosignatures: CosignatureSignedTransaction[]): SignedTransaction {
        // re-create the transaction from payload to determine the type - only allow aggregate complete transaction as an input
        const recreatedSignedTx = TransactionMapping.createFromPayload(signedTransaction.payload);
        if (recreatedSignedTx.type !== TransactionType.AGGREGATE_COMPLETE_V1) {
            throw new Error('Only serialized signed aggregate complete v1 transaction allowed.');
        }
        const recreatedSignedAggregateComplete = recreatedSignedTx as AggregateTransaction;

        const signedTransactionRaw = AggregatedTransactionCore.appendSignaturesV1(
            signedTransaction,
            cosignatures.filter(cosignature => ! recreatedSignedAggregateComplete.signedByAccount(
                    PublicAccount.createFromPublicKey(cosignature.signer, recreatedSignedAggregateComplete.version.networkType))));

        return new SignedTransaction(
            signedTransactionRaw.payload,
            signedTransaction.hash,
            signedTransaction.signer,
            signedTransaction.type,
            signedTransaction.networkType
        );
    }
}
