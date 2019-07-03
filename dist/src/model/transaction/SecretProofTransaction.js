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
const format_1 = require("../../core/format");
const SecretProofTransaction_1 = require("../../infrastructure/builders/SecretProofTransaction");
const UInt64_1 = require("../UInt64");
const HashType_1 = require("./HashType");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
class SecretProofTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param hashType
     * @param secret
     * @param recipient
     * @param proof
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, hashType, secret, recipient, proof, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.SECRET_PROOF, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.hashType = hashType;
        this.secret = secret;
        this.recipient = recipient;
        this.proof = proof;
        if (!HashType_1.HashTypeLengthValidator(hashType, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }
    /**
     * Create a secret proof transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The seed proof hashed.
     * @param recipient - UnresolvedAddress
     * @param proof - The seed proof.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     *
     * @return a SecretProofTransaction instance
     */
    static create(deadline, hashType, secret, recipient, proof, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new SecretProofTransaction(networkType, TransactionVersion_1.TransactionVersion.SECRET_PROOF, deadline, maxFee, hashType, secret, recipient, proof);
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a SecretProofTransaction
     * @returns {number}
     * @memberof SecretProofTransaction
     */
    get size() {
        const byteSize = super.size;
        // hash algorithm and proof size static byte size
        const byteAlgorithm = 1;
        const byteProofSize = 2;
        const byteRecipient = 25;
        // convert secret and proof to uint8
        const byteSecret = format_1.Convert.hexToUint8(this.secret).length;
        const byteProof = format_1.Convert.hexToUint8(this.proof).length;
        return byteSize + byteAlgorithm + byteSecret + byteRecipient + byteProofSize + byteProof;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new SecretProofTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addHashAlgorithm(this.hashType)
            .addSecret(this.secret)
            .addRecipient(this.recipient.plain())
            .addProof(this.proof)
            .build();
    }
}
exports.SecretProofTransaction = SecretProofTransaction;
//# sourceMappingURL=SecretProofTransaction.js.map