/*
 * Copyright 2023 ProximaX
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

import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { Transaction } from './Transaction';
import { Deadline } from './Deadline';
import { TransactionInfo } from './TransactionInfo';

/**
 * An unknown transaction class that hold the transaction dto with issue, 
 * these transaction exist at the blockchain.
 */
export class UnknownTransaction extends Transaction{

    /**
     * @constructor
     * @param unknownData
     * @param type
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(
            public readonly unknownData: Object,
            
            /**
             * The transaction type.
             */
            type: number,
            /**
             * The network type.
             */
            networkType: NetworkType,
            /**
             * The transaction version number.
             */
            version: number,
            /**
             * The deadline to include the transaction.
             */
            deadline: Deadline,
            /**
             * A sender of a transaction must specify during the transaction definition a max_fee,
             * meaning the maximum fee the account allows to spend for this transaction.
             */
            maxFee: UInt64,
            
            /**
             * The account of the transaction creator.
             */
            signer: PublicAccount,
            
            /**
             * The transaction signature (missing if part of an aggregate transaction).
             */
            signature?: string,
            
            /**
             * Transactions meta data object contains additional information about the transaction.
             */
            transactionInfo?: TransactionInfo | AggregateTransactionInfo,
            
            ) {
        super(type, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @internal
     * @description get the byte size of a UnknownTransaction, will return error
     * @returns {never}
     * @memberof UnknownTransaction
     */
    public get size(): never {
        throw new Error("Cannot get size of UnknownTransaction");
    }

    /**
     * @override Transaction.buildTransaction()
     * @internal
     * @description buildTransaction of UnknownTransaction, will return error
     * @returns {never}
     * @memberof UnknownTransaction
     */
    protected buildTransaction(): never {
        throw new Error("Cannot buildTransaction from UnknownTransaction");
    }

    /**
     * Convert an aggregate transaction to an inner transaction including transaction signer, will return error
     * @override Transaction.toAggregate()
     * @internal
     * @param signer - Transaction signer.
     * @returns never
     */
    public toAggregate(signer: PublicAccount): never {
        throw new Error('Cannot create inner transaction from UnknownTransaction.');
    }

    /**
     * Serialize and sign transaction creating a new SignedTransaction
     * @override Transaction.signWith()
     * @internal
     * @param account - The account to sign the transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {never}
     */
    public signWith(): never {
        throw new Error('Cannot sign UnknownTransaction');
    }

    /**
     * @override Transaction.aggregateTransaction()
     * @internal
     * @returns {never}
     */
    public aggregateTransaction(): never {
        throw new Error('Cannot aggregate UnknownTransaction');
    }

    /**
     * @override Transaction.reapplyGiven()
     * @internal
     * @description reapply a given value to the transaction in an immutable way
     * @returns {never}
     * @memberof UnknownTransaction
     */
    public reapplyGiven(): never {
        throw new Error('Cannot update UnknownTransaction');
    }

    /**
     * @override Transaction.reapplyGiven()
     * @internal
     * @description Serialize a transaction object
     * @returns {never}
     * @memberof UnknownTransaction
     */
    public serialize(): never {
        throw new Error('Cannot serialize UnknownTransaction');
    }

    /**
     * @override Transaction.toJSON()
     * @description Create JSON object
     * @returns {Object}
     * @memberof UnknownTransaction
     */
    public toJSON() {
        const commonTransactionObject = {
            type: this.type,
            networkType: this.networkType,
            version: this.versionToDTO(),
            maxFee: this.maxFee.toDTO(),
            deadline: this.deadline.toDTO(),
            signature: this.signature ? this.signature : '',
            signer: this.signer!.publicKey,
            unknownData: this.unknownData
        };

        return { transaction: commonTransactionObject };
    }
}