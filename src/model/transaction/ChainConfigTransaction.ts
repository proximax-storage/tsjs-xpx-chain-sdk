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
import { calculateFee, FeeCalculationStrategy } from './FeeCalculationStrategy';

export class ChainConfigTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param applyHeightDelta
     * @param networkConfig,
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
        public readonly networkConfig: string,
        public readonly supportedEntityVersions: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.CHAIN_CONFIGURE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        applyHeightDelta: UInt64,
        networkConfig: string,
        supportedEntityVersions: string,
        networkType: NetworkType,
        maxFee?: UInt64): ChainConfigTransaction {
        return new ChainConfigTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .applyHeightDelta(applyHeightDelta)
            .networkConfig(networkConfig)
            .supportedEntityVersions(supportedEntityVersions)
            .build();
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return ChainConfigTransaction.calculateSize(this.networkConfig.length, this.supportedEntityVersions.length);
    }

    public static calculateSize(networkConfigLength: number, supportedEntityVersionsLength: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // applyHeightDelta
            + 2 // networkConfigSize
            + 2 // supportedEntityVersionsSize
            + networkConfigLength //networkConfig
            + supportedEntityVersionsLength // supportedEntityVersions
        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof ChainConfigTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                applyHeightDelta: this.applyHeightDelta.toDTO(),
                networkConfig: this.networkConfig,
                supportedEntityVersions: this.supportedEntityVersions
            }
        }
    }

    /**
    * @internal
    * @returns {VerifiableTransaction}
    */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addSize(this.size)
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addApplyHeightDelta(this.applyHeightDelta.toDTO())
            .addNetworkConfig(this.networkConfig)
            .addSupportedEntityVersions(this.supportedEntityVersions)
            .build();
    }
}

export class ChainConfigTransactionBuilder extends TransactionBuilder {
    private _applyHeightDelta: UInt64;
    private _networkConfig: string;
    private _supportedEntityVersions: string;

    constructor() {
        super();
        this._feeCalculationStrategy = FeeCalculationStrategy.ZeroFeeCalculationStrategy;
    }

    public applyHeightDelta(applyHeightDelta: UInt64) {
        this._applyHeightDelta = applyHeightDelta;
        return this;
    }

    public networkConfig(networkConfig: string) {
        this._networkConfig = networkConfig;
        return this;
    }

    public supportedEntityVersions(supportedEntityVersions: string) {
        this._supportedEntityVersions = supportedEntityVersions;
        return this;
    }

    public build(): ChainConfigTransaction {
        return new ChainConfigTransaction(
            this._networkType,
            this._version || TransactionVersion.CHAIN_CONFIG,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(ChainConfigTransaction.calculateSize(this._networkConfig.length, this._supportedEntityVersions.length), this._feeCalculationStrategy),
            this._applyHeightDelta,
            this._networkConfig,
            this._supportedEntityVersions,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
