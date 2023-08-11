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
import { DerivationScheme } from '../../core/crypto';

/**
 * A known transaction class that hold the basic transaction, without any extra details. 
 */
export class BasicTransaction extends Transaction{

    /**
     * @constructor
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
            signer?: PublicAccount,
            
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
     * @description get the byte size of a BasicTransaction, will return error
     * @returns {number}
     * @memberof BasicTransaction
     */
    public get size(): number {
        return Transaction.getHeaderSize();
    }

    /**
     * @override Transaction.buildTransaction()
     * @description buildTransaction of BasicTransaction, will return error
     * @returns {never}
     * @memberof BasicTransaction
     */
    protected buildTransaction(): never {
        throw new Error("SDK not yet implemented transaction");
    }

    /**
     * Convert an aggregate transaction to an inner transaction including transaction signer, will return error
     * @override Transaction.toAggregate()
     * @internal
     * @param signer - Transaction signer.
     * @returns {never}
     */
    public toAggregate(signer: PublicAccount): never {
        throw new Error("SDK not yet implemented transaction");
    }

    /**
     * @override Transaction.toJSON()
     * @description Create JSON object
     * @returns {Object}
     * @memberof BasicTransaction
     */
    public toJSON() {
        const commonTransactionObject = {
            type: this.type,
            networkType: this.version.networkType,
            version: this.versionToDTO(),
            maxFee: this.maxFee.toDTO(),
            deadline: this.deadline.toDTO(),
            signature: this.signature ? this.signature : '',
            signer: this.signer!.publicKey
        };

        return { transaction: commonTransactionObject };
    }
}