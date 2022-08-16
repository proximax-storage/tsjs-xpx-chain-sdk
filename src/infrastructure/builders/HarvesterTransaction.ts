// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/HarvesterTransaction
 */
 import {Convert as convert} from '../../core/format';
 import { VerifiableTransaction } from './VerifiableTransaction';
 import HarvesterTransactionSchema from '../schemas/HarvesterTransactionSchema';
 import {HarvesterTransactionBuffer} from '../buffers/HarvesterTransactionBuffer';
 
 const { flatbuffers } = require('flatbuffers');
 
 export default class HarvesterTransaction extends VerifiableTransaction {
     constructor(bytes) {
         super(bytes, HarvesterTransactionSchema);
     }
 }
 
 export class Builder {
     size: number;
     fee: number[];
     version: number;
     type: number;
     deadline: number[];
     harvesterKey: string;
 
     constructor() {
         this.fee = [0, 0];
         this.version = 1;
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
 
     addHarvesterKey(harvesterKey: string) {
         this.harvesterKey = harvesterKey;
         return this;
     }
 
     build() {
         const builder = new flatbuffers.Builder(1);
 
         // Create vectors
         const signatureVector = HarvesterTransactionBuffer
             .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
         const signerVector = HarvesterTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
         const deadlineVector = HarvesterTransactionBuffer.createDeadlineVector(builder, this.deadline);
         const feeVector = HarvesterTransactionBuffer.createMaxFeeVector(builder, this.fee);
         const harvesterVector = HarvesterTransactionBuffer.createHarvesterKeyVector(builder, convert.hexToUint8(this.harvesterKey));
 
         HarvesterTransactionBuffer.startHarvesterTransactionBuffer(builder);
         HarvesterTransactionBuffer.addSize(builder, this.size);
         HarvesterTransactionBuffer.addSignature(builder, signatureVector);
         HarvesterTransactionBuffer.addSigner(builder, signerVector);
         HarvesterTransactionBuffer.addVersion(builder, this.version);
         HarvesterTransactionBuffer.addType(builder, this.type);
         HarvesterTransactionBuffer.addMaxFee(builder, feeVector);
         HarvesterTransactionBuffer.addDeadline(builder, deadlineVector);
         HarvesterTransactionBuffer.addHarvesterKey(builder, harvesterVector);
 
         const codedTransfer = HarvesterTransactionBuffer.endHarvesterTransactionBuffer(builder);
         builder.finish(codedTransfer);
 
         const bytes = builder.asUint8Array();
 
         return new HarvesterTransaction(bytes);
     }
 }
 