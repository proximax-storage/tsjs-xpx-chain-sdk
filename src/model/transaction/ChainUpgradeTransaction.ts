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
import { Builder } from '../../infrastructure/builders/ChainUpgradeTransaction';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee, FeeCalculationStrategy } from './FeeCalculationStrategy';

export class ChainUpgradeTransaction extends Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly upgradePeriod: UInt64,
        public readonly newCatapultVersion: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo) {
            super(TransactionType.CHAIN_UPGRADE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    public static create(deadline: Deadline,
        upgradePeriod: UInt64,
        newCatapultVersion: UInt64,
        networkType: NetworkType,
        maxFee?: UInt64): ChainUpgradeTransaction {
        return new ChainUpgradeTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .upgradePeriod(upgradePeriod)
            .newCatapultVersion(newCatapultVersion)
            .build();
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return ChainUpgradeTransaction.calculateSize();
    }

    public static calculateSize(): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // upgradePeriod
            + 8; // newCatapultVersion
        return byteSize;
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
            .addUpgradePeriod(this.upgradePeriod.toDTO())
            .addNewCatapultVersion(this.newCatapultVersion.toDTO())
            .build();
    }
}

export class ChainUpgradeTransactionBuilder extends TransactionBuilder {
    private _upgradePeriod: UInt64;
    private _newCatapultVersion: UInt64;

    constructor() {
        super();
        this._feeCalculationStrategy = FeeCalculationStrategy.ZeroFeeCalculationStrategy;
    }

    public upgradePeriod(upgradePeriod: UInt64) {
        this._upgradePeriod = upgradePeriod;
        return this;
    }

    public newCatapultVersion(newCatapultVersion: UInt64) {
        this._newCatapultVersion = newCatapultVersion;
        return this;
    }

    public build(): ChainUpgradeTransaction {
        return new ChainUpgradeTransaction(
            this._networkType,
            TransactionVersion.CHAIN_UPGRADE,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(ChainUpgradeTransaction.calculateSize(), this._feeCalculationStrategy),
            this._upgradePeriod,
            this._newCatapultVersion,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
