/*
 * Copyright 2018 NEM
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

import { DerivationScheme } from '../../core/crypto';
import {CosignatureTransaction as CosignaturetransactionLibrary} from '../../infrastructure/builders/CosignatureTransaction';
import {Account} from '../account/Account';
import {PublicAccount} from '../account/PublicAccount';
import {AggregateTransaction} from './AggregateTransaction';
import {CosignatureSignedTransaction} from './CosignatureSignedTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Convert } from '../../core/format';

/**
 * Cosignature transaction is used to sign an aggregate transactions with missing cosignatures.
 */
export class CosignatureTransaction {
    /**
     * @param transactionToCosign
     */
    constructor(/**
                 * Transaction to cosign.
                 */
                public readonly transactionToCosign: AggregateTransaction) {

    }

    /**
     * Create a cosignature transaction
     * @param transactionToCosign - Transaction to cosign.
     * @returns {CosignatureTransaction}
     */
    public static create(transactionToCosign: AggregateTransaction) {
        if (transactionToCosign.isUnannounced()) {
            throw new Error('transaction to cosign should be announced first');
        }
        return new CosignatureTransaction(transactionToCosign);
    }

    /**
     * Co-sign transaction with transaction payload (off chain)
     * Creating a new CosignatureSignedTransaction
     * @param account - The signing account
     * @param payload - off transaction payload (aggregated transaction is unannounced)
     * @param generationHash - Network generation hash
     * @returns {CosignatureSignedTransaction}
     */
    public static signTransactionPayload(account: Account, payload: string, generationHash: string): CosignatureSignedTransaction {
        /**
         * For aggregated complete transaction, cosignatories are gathered off chain announced.
         */
        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(account.version);
        const transactionHash = VerifiableTransaction.createTransactionHash(payload, Array.from(Convert.hexToUint8(generationHash)));
        const aggregateSignatureTransaction = new CosignaturetransactionLibrary(transactionHash);
        const signedTransactionRaw = aggregateSignatureTransaction.signCosignatoriesTransaction(account, dScheme);
        return CosignatureSignedTransaction.create(signedTransactionRaw.parentHash,
            signedTransactionRaw.signature, dScheme,
            signedTransactionRaw.signer);
    }

    /**
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {CosignatureSignedTransaction}
     */
    public signWith(account: Account): CosignatureSignedTransaction {
        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(account.version);
        const aggregateSignatureTransaction = new CosignaturetransactionLibrary(this.transactionToCosign.transactionInfo!.hash);
        const signedTransactionRaw = aggregateSignatureTransaction.signCosignatoriesTransaction(account, dScheme);
        return CosignatureSignedTransaction.create(signedTransactionRaw.parentHash,
            signedTransactionRaw.signature, dScheme,
            signedTransactionRaw.signer);
    }

    /**
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {CosignatureSignedTransaction}
     */
    public preV2SignWith(account: Account): CosignatureSignedTransaction {
        const aggregateSignatureTransaction = new CosignaturetransactionLibrary(this.transactionToCosign.transactionInfo!.hash);
        const signedTransactionRaw = aggregateSignatureTransaction.signCosignatoriesTransaction(account, DerivationScheme.Ed25519Sha3);
        return CosignatureSignedTransaction.create(signedTransactionRaw.parentHash,
            signedTransactionRaw.signature, DerivationScheme.Ed25519Sha3,
            signedTransactionRaw.signer);
    }
}