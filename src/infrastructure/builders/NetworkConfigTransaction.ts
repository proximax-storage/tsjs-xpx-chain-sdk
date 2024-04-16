// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/NetworkConfigTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import NetworkConfigTransactionBufferPackage from '../buffers/NetworkConfigTransactionBuffer';
import NetworkConfigTransactionSchema from '../schemas/NetworkConfigTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    CatapultConfigTransactionBuffer,
} = NetworkConfigTransactionBufferPackage.Buffers;

import * as flatbuffers from 'flatbuffers';
import { Convert } from '../../core/format';

export default class NetworkConfigTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, NetworkConfigTransactionSchema);
    }
}

export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    applyHeightDelta: any;
    networkConfig: any;
    supportedEntityVersions: any;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.CHAIN_CONFIGURE;
    }

    addSize(size) {
        this.size = size;
        return this;
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }

    addApplyHeightDelta(applyHeightDelta) {
        this.applyHeightDelta = applyHeightDelta;
        return this;
    }

    addNetworkConfig(networkConfig) {
        this.networkConfig = networkConfig.split('').map(n=>n.charCodeAt(0));
        return this;
    }

    addSupportedEntityVersions(supportedEntityVersions) {
        this.supportedEntityVersions = supportedEntityVersions.split('').map(n=>n.charCodeAt(0));
        return this;
    }

    addVersion(version) {
        this.version = version;
        return this;
    }

    addType(type) {
        this.type = type;
        return this;
    }

    addDeadline(deadline) {
        this.deadline = deadline;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        const signatureVector = CatapultConfigTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = CatapultConfigTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = CatapultConfigTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = CatapultConfigTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const applyHeightDeltaVector = CatapultConfigTransactionBuffer
            .createApplyHeightDeltaVector(builder, this.applyHeightDelta);
        const networkConfigVector = CatapultConfigTransactionBuffer
            .createBlockNetworkConfigVector(builder, this.networkConfig);
        const supportedEntityVersionsVector = CatapultConfigTransactionBuffer
            .createSupportedEntityVersionsVector(builder, this.supportedEntityVersions);

        CatapultConfigTransactionBuffer.startCatapultConfigTransactionBuffer(builder);
        CatapultConfigTransactionBuffer.addSize(builder, this.size);
        CatapultConfigTransactionBuffer.addSignature(builder, signatureVector);
        CatapultConfigTransactionBuffer.addSigner(builder, signerVector);
        CatapultConfigTransactionBuffer.addVersion(builder, this.version);
        CatapultConfigTransactionBuffer.addType(builder, this.type);
        CatapultConfigTransactionBuffer.addMaxFee(builder, feeVector);
        CatapultConfigTransactionBuffer.addDeadline(builder, deadlineVector);
        CatapultConfigTransactionBuffer.addApplyHeightDelta(builder, applyHeightDeltaVector);
        CatapultConfigTransactionBuffer.addBlockNetworkConfigSize(builder, this.networkConfig.length);
        CatapultConfigTransactionBuffer.addSupportedEntityVersionsSize(builder, this.supportedEntityVersions.length);
        CatapultConfigTransactionBuffer.addBlockNetworkConfig(builder, networkConfigVector);
        CatapultConfigTransactionBuffer.addSupportedEntityVersions(builder, supportedEntityVersionsVector);

        // Calculate size
        const codedNetworkConfig = CatapultConfigTransactionBuffer.endCatapultConfigTransactionBuffer(builder);
        builder.finish(codedNetworkConfig);

        const bytes = builder.asUint8Array();
        return new NetworkConfigTransaction(bytes);
    }
}
