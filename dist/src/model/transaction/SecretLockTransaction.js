"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const SecretLockTransaction_1 = require("../../infrastructure/builders/SecretLockTransaction");
const HashType_1 = require("./HashType");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
class SecretLockTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaic
     * @param duration
     * @param hashType
     * @param secret
     * @param recipient
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, 
    /**
     * The locked mosaic.
     */
    mosaic, 
    /**
     * The duration for the funds to be released or returned.
     */
    duration, 
    /**
     * The hash algorithm, secret is generated with.
     */
    hashType, 
    /**
     * The proof hashed.
     */
    secret, 
    /**
     * The recipient of the funds.
     */
    recipient, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.SECRET_LOCK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.mosaic = mosaic;
        this.duration = duration;
        this.hashType = hashType;
        this.secret = secret;
        this.recipient = recipient;
        if (!HashType_1.HashTypeLengthValidator(hashType, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }
    /**
     * Create a secret lock transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param mosaic - The locked mosaic.
     * @param duration - The funds lock duration.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The proof hashed.
     * @param recipient - The recipient of the funds.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     *
     * @return a SecretLockTransaction instance
     */
    static create(deadline, mosaic, duration, hashType, secret, recipient, networkType, maxFee) {
        return new SecretLockTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaic(mosaic)
            .duration(duration)
            .hashType(hashType)
            .secret(secret)
            .recipient(recipient)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a SecretLockTransaction
     * @returns {number}
     * @memberof SecretLockTransaction
     */
    get size() {
        return SecretLockTransaction.calculateSize(this.secret);
    }
    static calculateSize(secret) {
        const byteSize = Transaction_1.Transaction.getHeaderSize();
        // set static byte size fields
        const byteMosaicId = 8;
        const byteAmount = 8;
        const byteDuration = 8;
        const byteAlgorithm = 1;
        const byteRecipient = 25;
        // get secret byte size
        const secretSize = secret.length / 2;
        return byteSize + byteMosaicId + byteAmount + byteDuration + byteAlgorithm + byteRecipient + secretSize;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new SecretLockTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addMosaicId(this.mosaic.id.id.toDTO())
            .addMosaicAmount(this.mosaic.amount.toDTO())
            .addDuration(this.duration.toDTO())
            .addHashAlgorithm(this.hashType)
            .addSecret(this.secret)
            .addRecipient(this.recipient.plain())
            .build();
    }
}
exports.SecretLockTransaction = SecretLockTransaction;
class SecretLockTransactionBuilder extends Transaction_1.TransactionBuilder {
    mosaic(mosaic) {
        this._mosaic = mosaic;
        return this;
    }
    duration(duration) {
        this._duration = duration;
        return this;
    }
    hashType(hashType) {
        this._hashType = hashType;
        return this;
    }
    secret(secret) {
        this._secret = secret;
        return this;
    }
    recipient(recipient) {
        this._recipient = recipient;
        return this;
    }
    build() {
        return new SecretLockTransaction(this._networkType, TransactionVersion_1.TransactionVersion.SECRET_LOCK, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(SecretLockTransaction.calculateSize(this._secret), this._feeCalculationStrategy), this._mosaic, this._duration, this._hashType, this._secret, this._recipient, this._signature, this._signer, this._transactionInfo);
    }
}
exports.SecretLockTransactionBuilder = SecretLockTransactionBuilder;
//# sourceMappingURL=SecretLockTransaction.js.map