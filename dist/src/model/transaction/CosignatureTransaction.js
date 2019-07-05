"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../../core/crypto");
const CosignatureTransaction_1 = require("../../infrastructure/builders/CosignatureTransaction");
const CosignatureSignedTransaction_1 = require("./CosignatureSignedTransaction");
const VerifiableTransaction_1 = require("../../infrastructure/builders/VerifiableTransaction");
/**
 * Cosignature transaction is used to sign an aggregate transactions with missing cosignatures.
 */
class CosignatureTransaction {
    /**
     * @param transactionToCosign
     */
    constructor(/**
                 * Transaction to cosign.
                 */ transactionToCosign) {
        this.transactionToCosign = transactionToCosign;
    }
    /**
     * Create a cosignature transaction
     * @param transactionToCosign - Transaction to cosign.
     * @returns {CosignatureTransaction}
     */
    static create(transactionToCosign) {
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
     * @param gernationHash - Network generation hash
     * @returns {CosignatureSignedTransaction}
     */
    static signTransactionPayload(account, payload, gernationHash) {
        /**
         * For aggregated complete transaction, cosignatories are gathered off chain announced.
         */
        const transactionHash = VerifiableTransaction_1.VerifiableTransaction.createTransactionHash(payload, gernationHash);
        const aggregateSignatureTransaction = new CosignatureTransaction_1.CosignatureTransaction(transactionHash);
        const signedTransactionRaw = aggregateSignatureTransaction.signCosignatoriesTransaction(account);
        return new CosignatureSignedTransaction_1.CosignatureSignedTransaction(signedTransactionRaw.parentHash, signedTransactionRaw.signature, signedTransactionRaw.signer);
    }
    /**
     * @internal
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {CosignatureSignedTransaction}
     */
    signWith(account, signSchema = crypto_1.SignSchema.SHA3) {
        const aggregateSignatureTransaction = new CosignatureTransaction_1.CosignatureTransaction(this.transactionToCosign.transactionInfo.hash);
        const signedTransactionRaw = aggregateSignatureTransaction.signCosignatoriesTransaction(account, signSchema);
        return new CosignatureSignedTransaction_1.CosignatureSignedTransaction(signedTransactionRaw.parentHash, signedTransactionRaw.signature, signedTransactionRaw.signer);
    }
}
exports.CosignatureTransaction = CosignatureTransaction;
//# sourceMappingURL=CosignatureTransaction.js.map