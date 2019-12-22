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

import { Builder } from '../../infrastructure/builders/TransferTransaction';
import { TransactionBuilder } from './Transaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Message } from './Message';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { EmptyMessage } from './PlainMessage';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Transfer transactions contain data about transfers of mosaics and message to another account.
 */
export class TransferTransaction extends Transaction {
    /**
     * Create a transfer transaction object
     * @param deadline - The deadline to include the transaction.
     * @param recipient - The recipient of the transaction.
     * @param mosaics - The array of mosaics.
     * @param message - The transaction message.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
    public static create(deadline: Deadline,
                         recipient: Address | NamespaceId,
                         mosaics: Mosaic[],
                         message: Message,
                         networkType: NetworkType,
                         maxFee?: UInt64): TransferTransaction {
        return new TransferTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .recipient(recipient)
            .mosaics(mosaics)
            .message(message)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param recipient
     * @param mosaics
     * @param message
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The address of the recipient.
                 */
                public readonly recipient: Address | NamespaceId,
                /**
                 * The array of Mosaic objects.
                 */
                public readonly mosaics: Mosaic[],
                /**
                 * The transaction message of 2048 characters.
                 */
                public readonly message: Message,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.TRANSFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Return the string notation for the set recipient
     * @internal
     * @returns {string}
     */
    public recipientToString(): string {

        if (this.recipient instanceof NamespaceId) {
            // namespaceId recipient, return hexadecimal notation
            return (this.recipient as NamespaceId).toHex();
        }

        // address recipient
        return (this.recipient as Address).plain();
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a TransferTransaction
     * @returns {number}
     * @memberof TransferTransaction
     */
    public get size(): number {
        return TransferTransaction.calculateSize(this.message.size(), this.mosaics.length)
    }

    public static calculateSize(messageSize: number, mosaicsCount: number): number {
        const byteSize = Transaction.getHeaderSize();

        // recipient and number of mosaics are static byte size
        const byteRecipient = 25;
        const byteNumMosaics = 2;
        const byteMessageSize = 2;
        return byteSize + byteRecipient + byteNumMosaics + byteMessageSize + messageSize + 16*mosaicsCount;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof TransferTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                recipient: this.recipient.toDTO(),
                mosaics: this.mosaics.map((mosaic) => {
                    return mosaic.toDTO();
                }),
                message: this.message.toDTO(),
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
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRecipient(this.recipientToString())
            .addMosaics(this.mosaics.map((mosaic) => mosaic.toDTO()))
            .addMessage(this.message)
            .build();
    }
}

export class TransferTransactionBuilder extends TransactionBuilder {
    private _recipient: Address | NamespaceId;
    private _mosaics: Mosaic[] = [];
    private _message: Message = EmptyMessage;

    public recipient(recipient: Address | NamespaceId) {
        this._recipient = recipient;
        return this;
    }

    public mosaics(mosaics: Mosaic[]) {
        this._mosaics = mosaics;
        return this;
    }

    public message(message: Message) {
        this._message = message;
        return this;
    }

    public build(): TransferTransaction {
        return new TransferTransaction(
            this._networkType,
            this._version || TransactionVersion.TRANSFER,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(TransferTransaction.calculateSize(this._message.size(), this._mosaics.length), this._feeCalculationStrategy),
            this._recipient,
            this._mosaics,
            this._message,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
