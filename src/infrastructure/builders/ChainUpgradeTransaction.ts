// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/ChainUpgradeTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import CatapultUpgradeTransactionBufferPackage from '../buffers/ChainUpgradeTransactionBuffer';
import ChainUpgradeTransactionSchema from '../schemas/ChainUpgradeTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    CatapultUpgradeTransactionBuffer,
} = CatapultUpgradeTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';

export default class ChainUpgradeTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ChainUpgradeTransactionSchema);
    }
}

export class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    upgradePeriod: any;
    newBlockchainVersion: any;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.CHAIN_UPGRADE;
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
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

    addUpgradePeriod(upgradePeriod) {
        this.upgradePeriod = upgradePeriod;
        return this;
    }

    addNewBlockchainVersion(newBlockchainVersion) {
        this.newBlockchainVersion = newBlockchainVersion;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        const signatureVector = CatapultUpgradeTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = CatapultUpgradeTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = CatapultUpgradeTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = CatapultUpgradeTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const upgradePeriodVector = CatapultUpgradeTransactionBuffer
            .createUpgradePeriodVector(builder, this.upgradePeriod);
        const newBlockchainVersionVector = CatapultUpgradeTransactionBuffer
            .createNewCatapultVersionVector(builder, this.newBlockchainVersion);


        CatapultUpgradeTransactionBuffer.startCatapultUpgradeTransactionBuffer(builder);
        CatapultUpgradeTransactionBuffer.addSize(builder, 122 + 8 + 8);
        CatapultUpgradeTransactionBuffer.addSignature(builder, signatureVector);
        CatapultUpgradeTransactionBuffer.addSigner(builder, signerVector);
        CatapultUpgradeTransactionBuffer.addVersion(builder, this.version);
        CatapultUpgradeTransactionBuffer.addType(builder, this.type);
        CatapultUpgradeTransactionBuffer.addMaxFee(builder, feeVector);
        CatapultUpgradeTransactionBuffer.addDeadline(builder, deadlineVector);
        CatapultUpgradeTransactionBuffer.addUpgradePeriod(builder, upgradePeriodVector);
        CatapultUpgradeTransactionBuffer.addNewCatapultVersion(builder, newBlockchainVersionVector);

        // Calculate size
        const codedChainUpgrade = CatapultUpgradeTransactionBuffer.endCatapultUpgradeTransactionBuffer(builder);
        builder.finish(codedChainUpgrade);

        const bytes = builder.asUint8Array();
        return new ChainUpgradeTransaction(bytes);
    }
}
