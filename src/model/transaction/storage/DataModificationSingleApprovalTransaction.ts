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
import { PublicAccount } from '../../account/PublicAccount';
import { NetworkType } from '../../blockchain/NetworkType';
import { UInt64 } from '../../UInt64';
import { Deadline } from '../Deadline';
import { Transaction, TransactionBuilder } from '../Transaction';
import { TransactionInfo } from '../TransactionInfo';
import { TransactionType } from '../TransactionType';
import { TransactionTypeVersion } from '../TransactionTypeVersion';
import { calculateFee } from '../FeeCalculationStrategy';
import { Convert } from '../../../core/format/Convert';

export class DataModificationSingleApprovalTransaction extends Transaction {

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveKey - Public key of the drive
     * @param dataModificationId hash
     * @param publicKeysCount
     * @param publicKeys
     * @param opinions uint64[]
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
                public readonly dataModificationId: string, // hash
                public readonly publicKeysCount: number, // uint8
                public readonly publicKeys: PublicAccount[],
                public readonly opinions: UInt64[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.Data_Modification_Single_Approval,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a DataModificationSingleApprovalTransaction
     * @returns {number}
     * @memberof DataModificationSingleApprovalTransaction
     */
    public get size(): number {
        return DataModificationSingleApprovalTransaction.calculateSize(this.publicKeys.length, this.opinions.length);
    }

    public static calculateSize(publicKeysCount: number, opinionsCount: number): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const dataModificationId = 32;
        const publicKeysCountSize = 1;
        const publicKeysSize = 32 * publicKeysCount;
        const opinionsSize = 8 * opinionsCount;

        return baseByteSize + driveKeySize + dataModificationId + publicKeysCountSize + publicKeysSize + opinionsSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof DataModificationSingleApprovalTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.toDTO(),
                dataModificationId: this.dataModificationId,
                publicKeysCount: this.publicKeysCount,
                publicKeys: this.publicKeys.map((pa)=> pa.publicKey),
                opinions: this.opinions.map((data)=> data.toBigInt())
            }
        }
    }

    /**
     * @internal
     * @returns {never}
     */
    protected buildTransaction(): never {
        throw new Error("Not yet implemented")
    }
}
