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
import { Builder } from '../../infrastructure/builders/SecretLockTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { HashType, HashTypeLengthValidator } from './HashType';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';

export class SecretLockTransaction extends Transaction {

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
    public static create(deadline: Deadline,
                         mosaic: Mosaic,
                         duration: UInt64,
                         hashType: HashType,
                         secret: string,
                         recipient: Address,
                         networkType: NetworkType,
                         maxFee?: UInt64): SecretLockTransaction {
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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The locked mosaic.
                 */
                public readonly mosaic: Mosaic,
                /**
                 * The duration for the funds to be released or returned.
                 */
                public readonly duration: UInt64,
                /**
                 * The hash algorithm, secret is generated with.
                 */
                public readonly hashType: HashType,
                /**
                 * The proof hashed.
                 */
                public readonly secret: string,
                /**
                 * The recipient of the funds.
                 */
                public readonly recipient: Address,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.SECRET_LOCK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        if (!HashTypeLengthValidator(hashType, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a SecretLockTransaction
     * @returns {number}
     * @memberof SecretLockTransaction
     */
    public get size(): number {
        return SecretLockTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const byteMosaicId = 8;
        const byteAmount = 8;
        const byteDuration = 8;
        const byteAlgorithm = 1;
        const secretSize = 32;
        const byteRecipient = 25;

        return byteSize + byteMosaicId + byteAmount + byteDuration + byteAlgorithm + byteRecipient + secretSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof SecretLockTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                mosaicId: this.mosaic.id.id.toDTO(),
                amount: this.mosaic.amount.toDTO(),
                duration: this.duration.toDTO(),
                hashAlgorithm: this.hashType,
                secret: this.secret,
                recipient: this.recipient.toDTO(),
            }
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addSize(this.size)
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

export class SecretLockTransactionBuilder extends TransactionBuilder {
    private _mosaic: Mosaic;
    private _duration: UInt64;
    private _hashType: HashType;
    private _secret: string;
    private _recipient: Address;

    public mosaic(mosaic: Mosaic) {
        this._mosaic = mosaic;
        return this;
    }

    public duration(duration: UInt64) {
        this._duration = duration;
        return this;
    }

    public hashType(hashType: HashType) {
        this._hashType = hashType;
        return this;
    }

    public secret(secret: string) {
        this._secret = secret;
        return this;
    }

    public recipient(recipient: Address) {
        this._recipient = recipient;
        return this;
    }

    public build(): SecretLockTransaction {
        return new SecretLockTransaction(
            this._networkType,
            this._version || TransactionVersion.SECRET_LOCK,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(SecretLockTransaction.calculateSize(), this._feeCalculationStrategy),
            this._mosaic,
            this._duration,
            this._hashType,
            this._secret,
            this._recipient,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
