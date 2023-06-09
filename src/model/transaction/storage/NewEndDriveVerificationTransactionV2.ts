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

import { Builder } from '../../../infrastructure/builders/storage/NewEndDriveVerificationV2Transaction';
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

export class NewEndDriveVerificationV2Transaction extends Transaction {

    /**
     * Create a new replicator onboarding transaction object
     * @param deadline - The deadline to include the transaction.
     * @param driveKey - Public key of the drive
     * @param verificationTrigger - The hash of block that initiated the Verification
     * @param shardId - Shard identifier, type unsigned short integer
     * @param keys - Replicators' public keys 
     * @param signatures - Signatures of replicators' opinions
     * @param opinions - Two-dimensional bit array of opinions (1 is success, 0 is failure)
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NewEndDriveVerificationV2Transaction}
     */
    public static create(deadline: Deadline,
                         driveKey: PublicAccount,
                         verificationTrigger: string,
                         shardId: number,
                         keys: PublicAccount[],
                         signatures: string[],
                         opinions: number,
                         networkType: NetworkType,
                         maxFee?: UInt64): NewEndDriveVerificationV2Transaction {
        
        return new NewEndDriveVerificationV2TransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .driveKey(driveKey)
            .verificationTrigger(verificationTrigger)
            .shardId(shardId)
            .keys(keys)
            .signatures(signatures)
            .opinions(opinions)
            .maxFee(maxFee)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param driveKey - The drive key
     * @param verificationTrigger - hash (32 bytes) 
     * @param shardId - shard id of type short unsigned integer
     * @param keys - punlic keys 
     * @param signatures - Signatures array (64 bytes)
     * @param opinions - uint8
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly driveKey: PublicAccount,
                public readonly verificationTrigger: string,
                public readonly shardId: number,
                public readonly keys: PublicAccount[],
                public readonly signatures: string[],
                public readonly opinions: number,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {

        super(TransactionType.EndDriveVerificationV2,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);

        if(!Convert.isHexString(verificationTrigger) && verificationTrigger.length !== 64){
            throw new Error("verificationTrigger should be 32 bytes hash string")
        }

        if(shardId > 0xFFFF || shardId < 0){
            throw new Error("shardId out of range, should be unsigned short integer")
        }

        if(opinions > 0xFF || opinions < 0){
            throw new Error("opinions out of range, should be unsigned byte integer")
        }      
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a NewEndDriveVerificationV2Transaction
     * @returns {number}
     * @memberof NewEndDriveVerificationV2Transaction
     */
    public get size(): number {
        return NewEndDriveVerificationV2Transaction.calculateSize(this.keys.length, this.signatures.length);
    }

    public static calculateSize(keysCount: number, judgingKeyCount: number): number {
        const baseByteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const driveKeySize = 32;
        const verificationTriggerSize = 32;
        const shardId = 2;
        const keysCountSize = 1;
        const judgingKeyCountSize = 1;

        // nested size
        const keySize = 32;
        const signatureSize = 64;

        return baseByteSize + driveKeySize + verificationTriggerSize + shardId 
            + keysCountSize + judgingKeyCountSize 
            + (keysCount * keySize) + ( judgingKeyCount * signatureSize)
            + ( (keysCount * judgingKeyCount) +7)/8;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof NewEndDriveVerificationV2Transaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                driveKey: this.driveKey.publicKey,
                verificationTrigger: this.verificationTrigger,
                shardId: this.shardId,
                keys: this.keys.map((data)=> data.toDTO()),
                signatures: this.signatures.map((data)=> data),
                opinions: this.opinions
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
            .addDriveKey(this.driveKey.publicKey)
            .addVerificationTrigger(this.verificationTrigger)
            .addShardId(this.shardId)
            .addKeys(this.keys.map((key)=> key.publicKey))
            .addSignatures(this.signatures.map((signature)=> signature))
            .addOpinions(this.opinions)
            .build();
    }
}

export class NewEndDriveVerificationV2TransactionBuilder extends TransactionBuilder {
    private _driveKey: PublicAccount;
    private _verificationTrigger: string;
    private _shardId: number;
    private _keys: PublicAccount[];
    private _signatures: string[];
    private _opinions: number;

    public driveKey(driveKey: PublicAccount) {
        this._driveKey = driveKey;
        return this;
    }

    public verificationTrigger(verificationTrigger: string) {
        this._verificationTrigger = verificationTrigger;
        return this;
    }

    public shardId(shardId: number) {
        this._shardId = shardId;
        return this;
    }

    public keys(keys: PublicAccount[]) {
        this._keys = keys;
        return this;
    }

    public signatures(signatures: string[]) {
        this._signatures = signatures;
        return this;
    }

    public opinions(opinions: number) {
        this._opinions = opinions;
        return this;
    }

    public build(): NewEndDriveVerificationV2Transaction {
        return new NewEndDriveVerificationV2Transaction(
            this._networkType,
            this._version || TransactionTypeVersion.EndDriveVerificationV2,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NewEndDriveVerificationV2Transaction.calculateSize(this._keys.length, this._signatures.length), this._feeCalculationStrategy),
            this._driveKey,
            this._verificationTrigger,
            this._shardId,
            this._keys,
            this._signatures,
            this._opinions,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
