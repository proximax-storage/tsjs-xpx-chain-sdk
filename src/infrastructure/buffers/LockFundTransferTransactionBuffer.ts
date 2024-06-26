// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { MosaicBuffer } from './MosaicBuffer';


export class LockFundTransferTransactionBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):LockFundTransferTransactionBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsLockFundTransferTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:LockFundTransferTransactionBuffer):LockFundTransferTransactionBuffer {
  return (obj || new LockFundTransferTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsLockFundTransferTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:LockFundTransferTransactionBuffer):LockFundTransferTransactionBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new LockFundTransferTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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

duration(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

durationLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

durationArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

action():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : 0;
}

mosaicsCount():number {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : 0;
}

mosaics(index: number, obj?:MosaicBuffer):MosaicBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? (obj || new MosaicBuffer()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

mosaicsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startLockFundTransferTransactionBuffer(builder:flatbuffers.Builder) {
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

static addDuration(builder:flatbuffers.Builder, durationOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, durationOffset, 0);
}

static createDurationVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createDurationVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createDurationVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startDurationVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addAction(builder:flatbuffers.Builder, action:number) {
  builder.addFieldInt8(8, action, 0);
}

static addMosaicsCount(builder:flatbuffers.Builder, mosaicsCount:number) {
  builder.addFieldInt8(9, mosaicsCount, 0);
}

static addMosaics(builder:flatbuffers.Builder, mosaicsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(10, mosaicsOffset, 0);
}

static createMosaicsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startMosaicsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endLockFundTransferTransactionBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishLockFundTransferTransactionBufferBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedLockFundTransferTransactionBufferBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

static createLockFundTransferTransactionBuffer(builder:flatbuffers.Builder, size:number, signatureOffset:flatbuffers.Offset, signerOffset:flatbuffers.Offset, version:number, type:number, maxFeeOffset:flatbuffers.Offset, deadlineOffset:flatbuffers.Offset, durationOffset:flatbuffers.Offset, action:number, mosaicsCount:number, mosaicsOffset:flatbuffers.Offset):flatbuffers.Offset {
  LockFundTransferTransactionBuffer.startLockFundTransferTransactionBuffer(builder);
  LockFundTransferTransactionBuffer.addSize(builder, size);
  LockFundTransferTransactionBuffer.addSignature(builder, signatureOffset);
  LockFundTransferTransactionBuffer.addSigner(builder, signerOffset);
  LockFundTransferTransactionBuffer.addVersion(builder, version);
  LockFundTransferTransactionBuffer.addType(builder, type);
  LockFundTransferTransactionBuffer.addMaxFee(builder, maxFeeOffset);
  LockFundTransferTransactionBuffer.addDeadline(builder, deadlineOffset);
  LockFundTransferTransactionBuffer.addDuration(builder, durationOffset);
  LockFundTransferTransactionBuffer.addAction(builder, action);
  LockFundTransferTransactionBuffer.addMosaicsCount(builder, mosaicsCount);
  LockFundTransferTransactionBuffer.addMosaics(builder, mosaicsOffset);
  return LockFundTransferTransactionBuffer.endLockFundTransferTransactionBuffer(builder);
}
}
