/*
 * Copyright 2023 ProximaX
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

import { Builder } from '../../infrastructure/builders/HashLockTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { SignedTransaction } from './SignedTransaction';
import { TransactionHash } from './TransactionHash';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Hash lock transaction is used before sending an Aggregate bonded transaction, as a deposit to announce the transaction.
 * When aggregate bonded transaction is confirmed funds are returned to HashLockTransaction signer.
 *
 * @since 1.0
 */
export class HashLockTransaction extends Transaction {

    /**
     * Aggregate bonded hash.
     */
    public readonly hash: string;

    /**
     * Create a Lock funds transaction object
     * @param deadline - The deadline to include the transaction.
     * @param mosaic - The locked mosaic.
     * @param duration - The funds lock duration.
     * @param signedTransaction - The signed transaction for which funds are locked.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {HashLockTransaction}
     */
    public static create(deadline: Deadline,
                         mosaic: Mosaic,
                         duration: UInt64,
                         transactionHash: TransactionHash | SignedTransaction,
                         networkType: NetworkType,
                         maxFee?: UInt64): HashLockTransaction {

        let txnHashToLock = transactionHash instanceof TransactionHash ? 
            transactionHash : new TransactionHash(transactionHash.hash, transactionHash.type);
        
        return new HashLockTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaic(mosaic)
            .duration(duration)
            .transactionHash(txnHashToLock)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaic
     * @param duration
     * @param signedTransaction
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
                 * The funds lock duration.
                 */
                public readonly duration: UInt64,
                transactionHash: TransactionHash, 
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.HASH_LOCK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.hash = transactionHash.hash;
        if (transactionHash.type !== TransactionType.AGGREGATE_BONDED_V1 && transactionHash.type !== TransactionType.AGGREGATE_BONDED_V2) {
            throw new Error('Signed transaction must be Aggregate Bonded Transaction');
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a HashLockTransaction
     * @returns {number}
     * @memberof HashLockTransaction
     */
    public get size(): number {
        return HashLockTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const byteMosaicId = 8;
        const byteAmount = 8;
        const byteDuration = 8;
        const byteHash = 32;

        return byteSize + byteMosaicId + byteAmount + byteDuration + byteHash;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof HashLockTransaction
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
                hash: this.hash,
            }
        }
    }

    /**
     * @internal
     * @return {VerifiableTransaction}
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
            .addHash(this.hash)
            .build();
    }
}
export class HashLockTransactionBuilder extends TransactionBuilder {
    private _mosaic: Mosaic;
    private _duration: UInt64;
    private _transactionHash: TransactionHash;

    public mosaic(mosaic: Mosaic) {
        this._mosaic = mosaic;
        return this;
    }

    public duration(duration: UInt64) {
        this._duration = duration;
        return this;
    }

    public transactionHash(transactionHash: TransactionHash | SignedTransaction) {

        this._transactionHash = transactionHash instanceof TransactionHash ? 
            transactionHash : new TransactionHash(transactionHash.hash, transactionHash.type);

        return this;
    }

    public build(): HashLockTransaction {
        return new HashLockTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.HASH_LOCK,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(HashLockTransaction.calculateSize(), this._feeCalculationStrategy),
            this._mosaic,
            this._duration,
            this._transactionHash,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
