/*
 * Copyright 2024 ProximaX
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

import { Builder } from '../../infrastructure/builders/AccountV2UpgradeTransaction';
import { TransactionBuilder } from './Transaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee } from './FeeCalculationStrategy';

/**
 * Announce an AccountV2UpgradeTransaction to move from v1 account to v2 account.
 */
export class AccountV2UpgradeTransaction extends Transaction {
    /**
     * Create a account v2 upgrade transaction object
     * @param deadline - The deadline to include the transaction.
     * @param newPublicAccountKey - The public key of the v2 account.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountV2UpgradeTransaction}
     */
    public static create(deadline: Deadline,
                         newPublicAccountKey: string,
                         networkType: NetworkType,
                         maxFee?: UInt64): AccountV2UpgradeTransaction {
        return new AccountV2UpgradeTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .newPublicAccountKey(newPublicAccountKey)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param newPublicAccountKey
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The public key of the v2 account.
                 */
                public readonly newPublicAccountKey: string,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.Account_V2_Upgrade, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountV2UpgradeTransaction
     * @returns {number}
     * @memberof AccountV2UpgradeTransaction
     */
    public get size(): number {
        return AccountV2UpgradeTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const bytePublicKey = 32;

        return byteSize + bytePublicKey;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AccountV2UpgradeTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                newPublicAccountKey: this.newPublicAccountKey,
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
            .addNewPublicAccountKey(this.newPublicAccountKey)
            .build();
    }

}

export class AccountV2UpgradeTransactionBuilder extends TransactionBuilder {
    private _newPublicAccountKey: string;

    public newPublicAccountKey(newPublicAccountKey: string) {
        this._newPublicAccountKey = newPublicAccountKey;
        return this;
    }

    public build(): AccountV2UpgradeTransaction {
        return new AccountV2UpgradeTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.Account_V2_Upgrade,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(AccountV2UpgradeTransaction.calculateSize(), this._feeCalculationStrategy),
            this._newPublicAccountKey,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
