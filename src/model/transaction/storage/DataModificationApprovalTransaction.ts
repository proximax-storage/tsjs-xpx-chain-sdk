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

import { Builder } from '../../../infrastructure/builders/storage/NewDataModificationTransaction';
import {VerifiableTransaction} from '../../../infrastructure/builders/VerifiableTransaction';
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

export class DataModificationApprovalTransaction extends Transaction {

    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
	            public readonly dataModificationId: string, // hash
                public readonly modificationStatus: number, // uint8
	            public readonly fileStructureCdi: string, // hash
	            public readonly fileStructureSizeBytes: UInt64,
	            public readonly metaFilesSizeBytes: UInt64,
	            public readonly usedDriveSizeBytes: UInt64,
	            public readonly judgingKeysCount: number, //uint8
	            public readonly overlappingKeysCount: number,//uint8
	            public readonly judgedKeysCount: number, //uint8
	            public readonly opinionElementCount :number, //uint16
	            public readonly publicKeys: PublicAccount[],
	            public readonly signatures: string[],
	            public readonly presentOpinions: Uint8Array,
	            public readonly opinions: UInt64[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.Data_Modification_Approval,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a DataModificationApprovalTransaction
     * @returns {number}
     * @memberof DataModificationApprovalTransaction
     */
    public get size(): number {
        return DataModificationApprovalTransaction.calculateSize(this.publicKeys.length, this.signatures.length, this.presentOpinions.length, this.opinions.length);
    }

    public static calculateSize(publicKeysCount: number, signaturesCount: number, presentOpinionsCount: number, opinionsCount: number): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const dataModificationId = 32;
        const modificationStatus = 1;
        const fileStructureCdi = 32;
        const fileStructureSizeBytes = 8;
        const metaFilesSizeBytes = 8;
        const usedDriveSizeBytes = 8;
        const judgingKeysCount = 1;
        const overlappingKeysCount = 1;
        const judgedKeysCount = 1;
        const opinionElementCount = 2;
        const publicKeysSize = publicKeysCount * 32;
        const signaturesSize = signaturesCount * 64;
        const opinionsSize = opinionsCount * 8;

        return baseByteSize + driveKeySize + dataModificationId + modificationStatus + fileStructureCdi + fileStructureSizeBytes + 
        metaFilesSizeBytes + usedDriveSizeBytes + judgingKeysCount + overlappingKeysCount + judgedKeysCount + 
        opinionElementCount + publicKeysSize + signaturesSize + presentOpinionsCount + opinionsSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof DataModificationApprovalTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.publicKey,
	            dataModificationId: this.dataModificationId,
	            fileStructureCdi: this.fileStructureCdi,
	            fileStructureSizeBytes: this.fileStructureSizeBytes.toBigInt(),
	            metaFilesSizeBytes: this.metaFilesSizeBytes.toBigInt(),
	            usedDriveSizeBytes: this.usedDriveSizeBytes.toBigInt(),
	            judgingKeysCount: this.judgingKeysCount,
	            overlappingKeysCount: this.overlappingKeysCount,
	            judgedKeysCount: this.judgedKeysCount,
	            opinionElementCount: this.opinionElementCount,
	            publicKeys: this.publicKeys.map(t=> t.publicKey),
	            signatures: this.signatures.map(t=> t),
	            presentOpinions: this.presentOpinions,
	            opinions: this.opinions.map(t=>t.toBigInt()),
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
