// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class MosaicAddressRestrictionTransactionBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):MosaicAddressRestrictionTransactionBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsMosaicAddressRestrictionTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:MosaicAddressRestrictionTransactionBuffer):MosaicAddressRestrictionTransactionBuffer {
  return (obj || new MosaicAddressRestrictionTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsMosaicAddressRestrictionTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:MosaicAddressRestrictionTransactionBuffer):MosaicAddressRestrictionTransactionBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new MosaicAddressRestrictionTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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

mosaicId(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

mosaicIdLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

mosaicIdArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

restrictionKey(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

restrictionKeyLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

restrictionKeyArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

previousRestrictionValue(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

previousRestrictionValueLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

previousRestrictionValueArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

newRestrictionValue(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

newRestrictionValueLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

newRestrictionValueArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

targetAddress(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 26);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

targetAddressLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 26);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

targetAddressArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 26);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

static startMosaicAddressRestrictionTransactionBuffer(builder:flatbuffers.Builder) {
  builder.startObject(12);
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

static addMosaicId(builder:flatbuffers.Builder, mosaicIdOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, mosaicIdOffset, 0);
}

static createMosaicIdVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createMosaicIdVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createMosaicIdVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startMosaicIdVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addRestrictionKey(builder:flatbuffers.Builder, restrictionKeyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(8, restrictionKeyOffset, 0);
}

static createRestrictionKeyVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createRestrictionKeyVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createRestrictionKeyVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startRestrictionKeyVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addPreviousRestrictionValue(builder:flatbuffers.Builder, previousRestrictionValueOffset:flatbuffers.Offset) {
  builder.addFieldOffset(9, previousRestrictionValueOffset, 0);
}

static createPreviousRestrictionValueVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createPreviousRestrictionValueVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createPreviousRestrictionValueVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startPreviousRestrictionValueVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addNewRestrictionValue(builder:flatbuffers.Builder, newRestrictionValueOffset:flatbuffers.Offset) {
  builder.addFieldOffset(10, newRestrictionValueOffset, 0);
}

static createNewRestrictionValueVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createNewRestrictionValueVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createNewRestrictionValueVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startNewRestrictionValueVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addTargetAddress(builder:flatbuffers.Builder, targetAddressOffset:flatbuffers.Offset) {
  builder.addFieldOffset(11, targetAddressOffset, 0);
}

static createTargetAddressVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startTargetAddressVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static endMosaicAddressRestrictionTransactionBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createMosaicAddressRestrictionTransactionBuffer(builder:flatbuffers.Builder, size:number, signatureOffset:flatbuffers.Offset, signerOffset:flatbuffers.Offset, version:number, type:number, maxFeeOffset:flatbuffers.Offset, deadlineOffset:flatbuffers.Offset, mosaicIdOffset:flatbuffers.Offset, restrictionKeyOffset:flatbuffers.Offset, previousRestrictionValueOffset:flatbuffers.Offset, newRestrictionValueOffset:flatbuffers.Offset, targetAddressOffset:flatbuffers.Offset):flatbuffers.Offset {
  MosaicAddressRestrictionTransactionBuffer.startMosaicAddressRestrictionTransactionBuffer(builder);
  MosaicAddressRestrictionTransactionBuffer.addSize(builder, size);
  MosaicAddressRestrictionTransactionBuffer.addSignature(builder, signatureOffset);
  MosaicAddressRestrictionTransactionBuffer.addSigner(builder, signerOffset);
  MosaicAddressRestrictionTransactionBuffer.addVersion(builder, version);
  MosaicAddressRestrictionTransactionBuffer.addType(builder, type);
  MosaicAddressRestrictionTransactionBuffer.addMaxFee(builder, maxFeeOffset);
  MosaicAddressRestrictionTransactionBuffer.addDeadline(builder, deadlineOffset);
  MosaicAddressRestrictionTransactionBuffer.addMosaicId(builder, mosaicIdOffset);
  MosaicAddressRestrictionTransactionBuffer.addRestrictionKey(builder, restrictionKeyOffset);
  MosaicAddressRestrictionTransactionBuffer.addPreviousRestrictionValue(builder, previousRestrictionValueOffset);
  MosaicAddressRestrictionTransactionBuffer.addNewRestrictionValue(builder, newRestrictionValueOffset);
  MosaicAddressRestrictionTransactionBuffer.addTargetAddress(builder, targetAddressOffset);
  return MosaicAddressRestrictionTransactionBuffer.endMosaicAddressRestrictionTransactionBuffer(builder);
}
}
