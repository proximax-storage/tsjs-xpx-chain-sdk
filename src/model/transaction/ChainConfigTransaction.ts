// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionType } from './TransactionType';
import { NetworkType } from '../blockchain/NetworkType';
import { Deadline } from './Deadline';
import { UInt64 } from '../UInt64';
import { PublicAccount } from '../account/PublicAccount';
import { TransactionInfo } from './TransactionInfo';
import { Builder } from '../../infrastructure/builders/ChainConfigTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';

export class ChainConfigTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param applyHeightDelta
     * @param blockChainConfig,
     * @param supportedEntityVersions,
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly applyHeightDelta: UInt64,
        public readonly blockChainConfig: string,
        public readonly supportedEntityVersions: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.CHAIN_CONFIGURE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        applyHeightDelta: UInt64,
        blockChainConfig: string,
        supportedEntityVersions: string,
        networkType: NetworkType,
        maxFee?: UInt64): ChainConfigTransaction {
        return new ChainConfigTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .applyHeightDelta(applyHeightDelta)
            .blockChainConfig(blockChainConfig)
            .supportedEntityVersions(supportedEntityVersions)
            .build();
    }

    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public static calculateSize(blockChainConfigLength: number, supportedEntityVersionsLength: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // applyHeightDelta
            + 2 // blockChainConfigSize
            + 2 // supportedEntityVersionsSize
            + blockChainConfigLength //blockChainConfig
            + supportedEntityVersionsLength // supportedEntityVersions
        return byteSize;
    }

    public get size(): number {
        return ChainConfigTransaction.calculateSize(this.blockChainConfig.length, this.supportedEntityVersions.length);
    }

    /**
    * @internal
    * @returns {VerifiableTransaction}
    */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addApplyHeightDelta(this.applyHeightDelta.toDTO())
            .addBlockChainConfig(this.blockChainConfig)
            .addSupportedEntityVersions(this.supportedEntityVersions)
            .build();
    }
}

export class ChainConfigTransactionBuilder extends TransactionBuilder {
    private _applyHeightDelta: UInt64;
    private _blockChainConfig: string;
    private _supportedEntityVersions: string;

    public applyHeightDelta(applyHeightDelta: UInt64) {
        this._applyHeightDelta = applyHeightDelta;
        return this;
    }

    public blockChainConfig(blockChainConfig: string) {
        this._blockChainConfig = blockChainConfig;
        return this;
    }

    public supportedEntityVersions(supportedEntityVersions: string) {
        this._supportedEntityVersions = supportedEntityVersions;
        return this;
    }

    public build(): ChainConfigTransaction {
        return new ChainConfigTransaction(
            this._networkType,
            TransactionVersion.CHAIN_CONFIG,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(ChainConfigTransaction.calculateSize(this._blockChainConfig.length, this._supportedEntityVersions.length)),
            this._applyHeightDelta,
            this._blockChainConfig,
            this._supportedEntityVersions,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}