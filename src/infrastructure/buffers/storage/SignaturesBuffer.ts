// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class SignaturesBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):SignaturesBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsSignaturesBuffer(bb:flatbuffers.ByteBuffer, obj?:SignaturesBuffer):SignaturesBuffer {
  return (obj || new SignaturesBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsSignaturesBuffer(bb:flatbuffers.ByteBuffer, obj?:SignaturesBuffer):SignaturesBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new SignaturesBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

signature(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

signatureLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

signatureArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

static startSignaturesBuffer(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addSignature(builder:flatbuffers.Builder, signatureOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, signatureOffset, 0);
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

static endSignaturesBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createSignaturesBuffer(builder:flatbuffers.Builder, signatureOffset:flatbuffers.Offset):flatbuffers.Offset {
  SignaturesBuffer.startSignaturesBuffer(builder);
  SignaturesBuffer.addSignature(builder, signatureOffset);
  return SignaturesBuffer.endSignaturesBuffer(builder);
}
}
