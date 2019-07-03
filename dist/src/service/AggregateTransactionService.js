"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const TransactionMapping_1 = require("../core/utils/TransactionMapping");
const MultisigCosignatoryModificationType_1 = require("../model/transaction/MultisigCosignatoryModificationType");
const TransactionType_1 = require("../model/transaction/TransactionType");
/**
 * Aggregated Transaction service
 */
class AggregateTransactionService {
    /**
     * Constructor
     * @param accountHttp
     */
    constructor(accountHttp) {
        this.accountHttp = accountHttp;
    }
    /**
     * Check if an aggregate complete transaction has all cosignatories attached
     * @param signedTransaction - The signed aggregate transaction (complete) to be verified
     * @returns {Observable<boolean>}
     */
    isComplete(signedTransaction) {
        const aggregateTransaction = TransactionMapping_1.TransactionMapping.createFromPayload(signedTransaction.payload);
        /**
         * Include both initiator & cosigners
         */
        const signers = (aggregateTransaction.cosignatures.map((cosigner) => cosigner.signer.publicKey));
        if (signedTransaction.signer) {
            signers.push(signedTransaction.signer);
        }
        return rxjs_1.from(aggregateTransaction.innerTransactions).pipe(operators_1.mergeMap((innerTransaction) => this.accountHttp.getMultisigAccountInfo(innerTransaction.signer.address)
            .pipe(
        /**
         * For multisig account, we need to get the graph info in case it has multiple levels
         */
        operators_1.mergeMap((_) => _.minApproval !== 0 && _.minRemoval !== 0 ?
            this.accountHttp.getMultisigAccountGraphInfo(_.account.address)
                .pipe(operators_1.map((graphInfo) => this.validateCosignatories(graphInfo, signers, innerTransaction))) : rxjs_1.of(signers.find((s) => s === _.account.publicKey) !== undefined)))), operators_1.toArray()).pipe(operators_1.flatMap((results) => {
            return rxjs_1.of(results.every((isComplete) => isComplete));
        }));
    }
    /**
     * Validate cosignatories against multisig Account(s)
     * @param graphInfo - multisig account graph info
     * @param cosignatories - array of cosignatories extracted from aggregated transaction
     * @param innerTransaction - the inner transaction of the aggregated transaction
     * @returns {boolean}
     */
    validateCosignatories(graphInfo, cosignatories, innerTransaction) {
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
        if (innerTransaction.type === TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT) {
            if (innerTransaction.modifications
                .find((modification) => modification.type === MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Remove) !== undefined) {
                isMultisigRemoval = true;
            }
        }
        sortedKeys.forEach((key) => {
            const multisigInfo = graphInfo.multisigAccounts.get(key);
            if (multisigInfo && !validationResult) {
                multisigInfo.forEach((multisig) => {
                    if (multisig.minApproval >= 1 && multisig.minRemoval) { // To make sure it is multisig account
                        const matchedCosignatories = this.compareArrays(cosignatoriesReceived, multisig.cosignatories.map((cosig) => cosig.publicKey));
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
                        }
                        else {
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
    compareArrays(array1, array2) {
        const results = [];
        array1.forEach((a1) => array2.forEach((a2) => {
            if (a1 === a2) {
                results.push(a1);
            }
        }));
        return results;
    }
}
exports.AggregateTransactionService = AggregateTransactionService;
//# sourceMappingURL=AggregateTransactionService.js.map