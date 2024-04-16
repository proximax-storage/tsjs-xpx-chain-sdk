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
import { Builder } from '../../infrastructure/builders/NetworkConfigAbsoluteHeightTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { calculateFee, FeeCalculationStrategy } from './FeeCalculationStrategy';

export class NetworkConfigAbsoluteHeightTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param applyHeight
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
        public readonly applyHeight: UInt64,
        public readonly networkConfig: string,
        public readonly supportedEntityVersions: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.NetworkConfig_Absolute_Height, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        applyHeight: UInt64,
        networkConfig: string,
        supportedEntityVersions: string,
        networkType: NetworkType,
        maxFee?: UInt64): NetworkConfigAbsoluteHeightTransaction {
        return new NetworkConfigAbsoluteHeightTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .applyHeight(applyHeight)
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
        return NetworkConfigAbsoluteHeightTransaction.calculateSize(this.networkConfig.length, this.supportedEntityVersions.length);
    }

    public static calculateSize(networkConfigLength: number, supportedEntityVersionsLength: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // applyHeight
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
     * @memberof NetworkConfigAbsoluteHeightTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                applyHeight: this.applyHeight.toDTO(),
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
            .addApplyHeight(this.applyHeight.toDTO())
            .addNetworkConfig(this.networkConfig)
            .addSupportedEntityVersions(this.supportedEntityVersions)
            .build();
    }
}

export class NetworkConfigAbsoluteHeightTransactionBuilder extends TransactionBuilder {
    private _applyHeight: UInt64;
    private _networkConfig: string;
    private _supportedEntityVersions: string;

    constructor() {
        super();
    }

    public applyHeight(applyHeight: UInt64) {
        this._applyHeight = applyHeight;
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

    public build(): NetworkConfigAbsoluteHeightTransaction {
        return new NetworkConfigAbsoluteHeightTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.NetworkConfig_Absolute_Height,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(NetworkConfigAbsoluteHeightTransaction.calculateSize(this._networkConfig.length, this._supportedEntityVersions.length), this._feeCalculationStrategy),
            this._applyHeight,
            this._networkConfig,
            this._supportedEntityVersions,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
