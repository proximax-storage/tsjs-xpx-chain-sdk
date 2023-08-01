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

/**
 * @module transactions/EndDriveVerificationV2Transaction
 */
import { Convert as convert } from '../../../core/format';
import { TransactionType } from '../../../model/transaction/TransactionType';
import { VerifiableTransaction } from '../VerifiableTransaction';
import EndDriveVerificationV2TransactionSchema from '../../schemas/storage/EndDriveVerificationV2TransactionSchema';
import { EndDriveVerificationTransactionV2Buffer } from '../../buffers/storage/EndDriveVerificationTransactionV2Buffer';

import * as flatbuffers from 'flatbuffers';

import { KeysBuffer } from '../../buffers/storage/KeysBuffer';
import { SignaturesBuffer } from '../../buffers/storage/SignaturesBuffer';

export default class NewEndDriveVerificationV2Transaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, EndDriveVerificationV2TransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    driveKey: string;
    verificationTrigger: string;
    shardId: number;
    keys: string[];
    signatures: string[];
    opinions: number;

    constructor() {
        this.fee = [0, 0];
        this.type = TransactionType.End_Drive_Verification_V2;
    }

    addSize(size: number) {
        this.size = size;
        return this;
    }

    addMaxFee(fee: number[]) {
        this.fee = fee;
        return this;
    }

    addVersion(version: number) {
        this.version = version;
        return this;
    }

    addType(type: number) {
        this.type = type;
        return this;
    }

    addDeadline(deadline: number[]) {
        this.deadline = deadline;
        return this;
    }

    addDriveKey(driveKey: string) {
        this.driveKey = driveKey;
        return this;
    }

    addVerificationTrigger(verificationTrigger: string) {
        this.verificationTrigger = verificationTrigger;
        return this;
    }

    addShardId(shardId: number) {
        this.shardId = shardId;
        return this;
    }

    addKeys(keys: string[]) {
        this.keys = keys;
        return this;
    }

    addSignatures(signatures: string[]) {
        this.signatures = signatures;
        return this;
    }

    addOpinions(opinions: number) {
        this.opinions = opinions;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = EndDriveVerificationTransactionV2Buffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = EndDriveVerificationTransactionV2Buffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = EndDriveVerificationTransactionV2Buffer.createDeadlineVector(builder, this.deadline);
        const feeVector = EndDriveVerificationTransactionV2Buffer.createMaxFeeVector(builder, this.fee);
        const driveKeyVector = EndDriveVerificationTransactionV2Buffer.createDriveKeyVector(builder, convert.hexToUint8(this.driveKey));
        const verificationTriggerVector = EndDriveVerificationTransactionV2Buffer.createVerificationTriggerVector(builder, convert.hexToUint8(this.verificationTrigger));

        const shardIdUint8Array = new Uint8Array([this.shardId, this.shardId >> 8]);

        const shardIdVector = EndDriveVerificationTransactionV2Buffer.createShardIdVector(builder, shardIdUint8Array);

        const keysVector = EndDriveVerificationTransactionV2Buffer.createKeysVector(builder, 
            this.keys.map(( key )=>{
                const keyBufferVector = KeysBuffer.createKeyVector(builder, convert.hexToUint8(key));
                KeysBuffer.startKeysBuffer(builder);
                KeysBuffer.addKey(builder, keyBufferVector);
                return KeysBuffer.endKeysBuffer(builder);
            })
        );
        const signaturesVector = EndDriveVerificationTransactionV2Buffer.createSignaturesVector(builder, 
            this.signatures.map(( signature )=>{
                const signatureBufferVector = SignaturesBuffer.createSignatureVector(builder, convert.hexToUint8(signature));
                SignaturesBuffer.startSignaturesBuffer(builder);
                SignaturesBuffer.addSignature(builder, signatureBufferVector);
                return SignaturesBuffer.endSignaturesBuffer(builder);
            })
        );
        
        EndDriveVerificationTransactionV2Buffer.startEndDriveVerificationTransactionV2Buffer(builder);
        EndDriveVerificationTransactionV2Buffer.addSize(builder, this.size);
        EndDriveVerificationTransactionV2Buffer.addSignature(builder, signatureVector);
        EndDriveVerificationTransactionV2Buffer.addSigner(builder, signerVector);
        EndDriveVerificationTransactionV2Buffer.addVersion(builder, this.version);
        EndDriveVerificationTransactionV2Buffer.addType(builder, this.type);
        EndDriveVerificationTransactionV2Buffer.addMaxFee(builder, feeVector);
        EndDriveVerificationTransactionV2Buffer.addDeadline(builder, deadlineVector);
        EndDriveVerificationTransactionV2Buffer.addDriveKey(builder, driveKeyVector);
        EndDriveVerificationTransactionV2Buffer.addVerificationTrigger(builder, verificationTriggerVector);
        EndDriveVerificationTransactionV2Buffer.addShardId(builder, shardIdVector);
        EndDriveVerificationTransactionV2Buffer.addKeyCount(builder, this.keys.length);
        EndDriveVerificationTransactionV2Buffer.addJudgingKeyCount(builder, this.signatures.length);
        EndDriveVerificationTransactionV2Buffer.addKeys(builder, keysVector);
        EndDriveVerificationTransactionV2Buffer.addSignatures(builder, signaturesVector);
        EndDriveVerificationTransactionV2Buffer.addOpinions(builder, this.opinions);

        const codedTransfer = EndDriveVerificationTransactionV2Buffer.endEndDriveVerificationTransactionV2Buffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new NewEndDriveVerificationV2Transaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}
