// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class ReplicatorOnboardingTransactionBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ReplicatorOnboardingTransactionBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsReplicatorOnboardingTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:ReplicatorOnboardingTransactionBuffer):ReplicatorOnboardingTransactionBuffer {
  return (obj || new ReplicatorOnboardingTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsReplicatorOnboardingTransactionBuffer(bb:flatbuffers.ByteBuffer, obj?:ReplicatorOnboardingTransactionBuffer):ReplicatorOnboardingTransactionBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ReplicatorOnboardingTransactionBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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

capacity(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.readUint32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

capacityLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

capacityArray():Uint32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? new Uint32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

static startReplicatorOnboardingTransactionBuffer(builder:flatbuffers.Builder) {
  builder.startObject(8);
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

static addCapacity(builder:flatbuffers.Builder, capacityOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, capacityOffset, 0);
}

static createCapacityVector(builder:flatbuffers.Builder, data:number[]|Uint32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createCapacityVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createCapacityVector(builder:flatbuffers.Builder, data:number[]|Uint32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startCapacityVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endReplicatorOnboardingTransactionBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createReplicatorOnboardingTransactionBuffer(builder:flatbuffers.Builder, size:number, signatureOffset:flatbuffers.Offset, signerOffset:flatbuffers.Offset, version:number, type:number, maxFeeOffset:flatbuffers.Offset, deadlineOffset:flatbuffers.Offset, capacityOffset:flatbuffers.Offset):flatbuffers.Offset {
  ReplicatorOnboardingTransactionBuffer.startReplicatorOnboardingTransactionBuffer(builder);
  ReplicatorOnboardingTransactionBuffer.addSize(builder, size);
  ReplicatorOnboardingTransactionBuffer.addSignature(builder, signatureOffset);
  ReplicatorOnboardingTransactionBuffer.addSigner(builder, signerOffset);
  ReplicatorOnboardingTransactionBuffer.addVersion(builder, version);
  ReplicatorOnboardingTransactionBuffer.addType(builder, type);
  ReplicatorOnboardingTransactionBuffer.addMaxFee(builder, maxFeeOffset);
  ReplicatorOnboardingTransactionBuffer.addDeadline(builder, deadlineOffset);
  ReplicatorOnboardingTransactionBuffer.addCapacity(builder, capacityOffset);
  return ReplicatorOnboardingTransactionBuffer.endReplicatorOnboardingTransactionBuffer(builder);
}
}
