// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class DataModificationTransactionBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):DataModificationTransactionBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsDataModificationTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:DataModificationTransactionBuffer):DataModificationTransactionBuffer {
  return (obj || new DataModificationTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsDataModificationTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:DataModificationTransactionBuffer):DataModificationTransactionBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new DataModificationTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

size():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint32(this.bb_pos + offset) : 0;
}

signature(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

signatureLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

signatureArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

signer(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

signerLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

signerArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

version():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readUint32(this.bb_pos + offset) : 0;
}

type():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

maxFee(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

maxFeeLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

maxFeeArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

deadline(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

deadlineLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

deadlineArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

driveKey(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

driveKeyLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

driveKeyArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

downloadDataCdi(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

downloadDataCdiLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

downloadDataCdiArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

uploadSize(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

uploadSizeLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

uploadSizeArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

feedbackFeeAmount(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

feedbackFeeAmountLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

feedbackFeeAmountArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

static startDataModificationTransactionBuffer(builder:flatbuffers.Builder) {
  builder.startObject(11);
}

static addSize(builder:flatbuffers.Builder, size:number) {
  builder.addFieldInt32(0, size, 0);
}

static addSignature(builder:flatbuffers.Builder, signatureOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, signatureOffset, 0);
}

static createSignatureVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startSignatureVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addSigner(builder:flatbuffers.Builder, signerOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, signerOffset, 0);
}

static createSignerVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startSignerVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addVersion(builder:flatbuffers.Builder, version:number) {
  builder.addFieldInt32(3, version, 0);
}

static addType(builder:flatbuffers.Builder, type:number) {
  builder.addFieldInt16(4, type, 0);
}

static addMaxFee(builder:flatbuffers.Builder, maxFeeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(5, maxFeeOffset, 0);
}

static createMaxFeeVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createMaxFeeVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createMaxFeeVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startMaxFeeVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addDeadline(builder:flatbuffers.Builder, deadlineOffset:flatbuffers.Offset) {
  builder.addFieldOffset(6, deadlineOffset, 0);
}

static createDeadlineVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createDeadlineVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createDeadlineVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startDeadlineVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addDriveKey(builder:flatbuffers.Builder, driveKeyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, driveKeyOffset, 0);
}

static createDriveKeyVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startDriveKeyVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addDownloadDataCdi(builder:flatbuffers.Builder, downloadDataCdiOffset:flatbuffers.Offset) {
  builder.addFieldOffset(8, downloadDataCdiOffset, 0);
}

static createDownloadDataCdiVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startDownloadDataCdiVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addUploadSize(builder:flatbuffers.Builder, uploadSizeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(9, uploadSizeOffset, 0);
}

static createUploadSizeVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createUploadSizeVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createUploadSizeVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startUploadSizeVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addFeedbackFeeAmount(builder:flatbuffers.Builder, feedbackFeeAmountOffset:flatbuffers.Offset) {
  builder.addFieldOffset(10, feedbackFeeAmountOffset, 0);
}

static createFeedbackFeeAmountVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createFeedbackFeeAmountVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createFeedbackFeeAmountVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startFeedbackFeeAmountVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endDataModificationTransactionBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createDataModificationTransactionBuffer(builder:flatbuffers.Builder, size:number, signatureOffset:flatbuffers.Offset, signerOffset:flatbuffers.Offset, version:number, type:number, maxFeeOffset:flatbuffers.Offset, deadlineOffset:flatbuffers.Offset, driveKeyOffset:flatbuffers.Offset, downloadDataCdiOffset:flatbuffers.Offset, uploadSizeOffset:flatbuffers.Offset, feedbackFeeAmountOffset:flatbuffers.Offset):flatbuffers.Offset {
  DataModificationTransactionBuffer.startDataModificationTransactionBuffer(builder);
  DataModificationTransactionBuffer.addSize(builder, size);
  DataModificationTransactionBuffer.addSignature(builder, signatureOffset);
  DataModificationTransactionBuffer.addSigner(builder, signerOffset);
  DataModificationTransactionBuffer.addVersion(builder, version);
  DataModificationTransactionBuffer.addType(builder, type);
  DataModificationTransactionBuffer.addMaxFee(builder, maxFeeOffset);
  DataModificationTransactionBuffer.addDeadline(builder, deadlineOffset);
  DataModificationTransactionBuffer.addDriveKey(builder, driveKeyOffset);
  DataModificationTransactionBuffer.addDownloadDataCdi(builder, downloadDataCdiOffset);
  DataModificationTransactionBuffer.addUploadSize(builder, uploadSizeOffset);
  DataModificationTransactionBuffer.addFeedbackFeeAmount(builder, feedbackFeeAmountOffset);
  return DataModificationTransactionBuffer.endDataModificationTransactionBuffer(builder);
}
}
