// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/NetworkConfigTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import { NetworkConfigAbsoluteHeightTransactionBuffer } from '../buffers/NetworkConfigAbsoluteHeightTransactionBuffer';
import NetworkConfigTransactionSchema from '../schemas/NetworkConfigAbsoluteHeightTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

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
    applyHeight: any;
    networkConfig: any;
    supportedEntityVersions: any;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.NetworkConfig_Absolute_Height;
    }

    addSize(size) {
        this.size = size;
        return this;
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }

    addApplyHeight(applyHeight) {
        this.applyHeight = applyHeight;
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

        const signatureVector = NetworkConfigAbsoluteHeightTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = NetworkConfigAbsoluteHeightTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = NetworkConfigAbsoluteHeightTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = NetworkConfigAbsoluteHeightTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const applyHeightVector = NetworkConfigAbsoluteHeightTransactionBuffer
            .createApplyHeightVector(builder, this.applyHeight);
        const networkConfigVector = NetworkConfigAbsoluteHeightTransactionBuffer
            .createNetworkConfigVector(builder, this.networkConfig);
        const supportedEntityVersionsVector = NetworkConfigAbsoluteHeightTransactionBuffer
            .createSupportedEntityVersionsVector(builder, this.supportedEntityVersions);

        NetworkConfigAbsoluteHeightTransactionBuffer.startNetworkConfigAbsoluteHeightTransactionBuffer(builder);
        NetworkConfigAbsoluteHeightTransactionBuffer.addSize(builder, this.size);
        NetworkConfigAbsoluteHeightTransactionBuffer.addSignature(builder, signatureVector);
        NetworkConfigAbsoluteHeightTransactionBuffer.addSigner(builder, signerVector);
        NetworkConfigAbsoluteHeightTransactionBuffer.addVersion(builder, this.version);
        NetworkConfigAbsoluteHeightTransactionBuffer.addType(builder, this.type);
        NetworkConfigAbsoluteHeightTransactionBuffer.addMaxFee(builder, feeVector);
        NetworkConfigAbsoluteHeightTransactionBuffer.addDeadline(builder, deadlineVector);
        NetworkConfigAbsoluteHeightTransactionBuffer.addApplyHeight(builder, applyHeightVector);
        NetworkConfigAbsoluteHeightTransactionBuffer.addNetworkConfigSize(builder, this.networkConfig.length);
        NetworkConfigAbsoluteHeightTransactionBuffer.addSupportedEntityVersionsSize(builder, this.supportedEntityVersions.length);
        NetworkConfigAbsoluteHeightTransactionBuffer.addNetworkConfig(builder, networkConfigVector);
        NetworkConfigAbsoluteHeightTransactionBuffer.addSupportedEntityVersions(builder, supportedEntityVersionsVector);

        // Calculate size
        const codedNetworkConfig = NetworkConfigAbsoluteHeightTransactionBuffer.endNetworkConfigAbsoluteHeightTransactionBuffer(builder);
        builder.finish(codedNetworkConfig);

        const bytes = builder.asUint8Array();
        return new NetworkConfigTransaction(bytes);
    }
}
