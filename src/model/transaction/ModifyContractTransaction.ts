// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionVersion } from './TransactionVersion';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Builder } from '../../infrastructure/builders/ModifyContractTransaction';
import { MultisigCosignatoryModification } from './MultisigCosignatoryModification';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';

export class ModifyContractTransaction extends Transaction {

    /**
     * Create ModifyContractTransaction object
     * @returns {ModifyContractTransaction}
     */
    public static create(networkType: NetworkType,
            deadline: Deadline,
            durationDelta: UInt64,
            hash: string,
            customers: MultisigCosignatoryModification[],
            executors: MultisigCosignatoryModification[],
            verifiers: MultisigCosignatoryModification[],
            maxFee?: UInt64): ModifyContractTransaction {
        return new ModifyContractTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .durationDelta(durationDelta)
            .hash(hash)
            .customers(customers)
            .executors(executors)
            .verifiers(verifiers)
            .build();
    }

    public hash: string;
    public durationDelta: UInt64;
    public customers: MultisigCosignatoryModification[];
    public executors: MultisigCosignatoryModification[];
    public verifiers: MultisigCosignatoryModification[];

    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        durationDelta: UInt64,
        hash: string,
        customers: MultisigCosignatoryModification[],
        executors: MultisigCosignatoryModification[],
        verifiers: MultisigCosignatoryModification[],
        maxFee: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(TransactionType.MODIFY_CONTRACT, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.durationDelta = durationDelta;
        this.hash = hash;
        this.customers = customers;
        this.executors = executors;
        this.verifiers = verifiers;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        return ModifyContractTransaction.calculateSize(this.hash.length, this.customers.length, this.executors.length, this.verifiers.length);
    }

    public static calculateSize(hashLength: number, customersCount: number, executorsCount: number, verifiersCount: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 8 // duration delta
            + hashLength/2 // hash (hex)
            + 1 // num customers
            + 1 // num executors
            + 1 // num verifiers
            + 33*(customersCount + executorsCount + verifiersCount);

        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof ModifyContractTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                durationDelta: this.durationDelta,
                hash: this.hash,
                customers: this.customers.map(customer => {
                    return customer.toDTO();
                }),
                executors: this.executors.map(executor => {
                    return executor.toDTO();
                }),
                verifiers: this.verifiers.map(verifier => {
                    return verifier.toDTO();
                }),
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
            .addType(this.type)
            .addVersion(this.versionToDTO())
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addHash(this.hash)
            .addDurationDelta(this.durationDelta.toDTO())
            .addCustomers(this.customers)
            .addExecutors(this.executors)
            .addVerifiers(this.verifiers)
            .build();
    }
}

export class ModifyContractTransactionBuilder extends TransactionBuilder {
    private _durationDelta: UInt64;
    private _hash: string;
    private _customers: MultisigCosignatoryModification[];
    private _executors: MultisigCosignatoryModification[];
    private _verifiers: MultisigCosignatoryModification[];

    public durationDelta(durationDelta: UInt64) {
        this._durationDelta = durationDelta;
        return this;
    }

    public hash(hash: string) {
        this._hash = hash;
        return this;
    }

    public customers(customers: MultisigCosignatoryModification[]) {
        this._customers = customers;
        return this;
    }

    public executors(executors: MultisigCosignatoryModification[]) {
        this._executors = executors;
        return this;
    }

    public verifiers(verifiers: MultisigCosignatoryModification[]) {
        this._verifiers = verifiers;
        return this;
    }

    public build(): ModifyContractTransaction {
        return new ModifyContractTransaction(
            this._networkType,
            this._version || TransactionVersion.MODIFY_CONTRACT,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._durationDelta,
            this._hash,
            this._customers,
            this._executors,
            this._verifiers,
            this._maxFee ? this._maxFee : calculateFee(ModifyContractTransaction.calculateSize(this._hash.length, this._customers.length, this._executors.length, this._verifiers.length), this._feeCalculationStrategy),
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
