// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Builder } from '../../infrastructure/builders/ModifyContractTransaction';
import { MultisigCosignatoryModification } from './MultisigCosignatoryModification';

export class ModifyContractTransaction extends Transaction {

    public hash: string;
    public durationDelta: UInt64;
    public customers: MultisigCosignatoryModification[];
    public executors: MultisigCosignatoryModification[];
    public verifiers: MultisigCosignatoryModification[];

    /**
     * Create a modify contract transaction object
     * @returns {ModifyContractTransaction}
     */
    public static create(
        networkType: NetworkType,
        deadline: Deadline,
        durationDelta: UInt64,
        hash: string,
        customers: MultisigCosignatoryModification[],
        executors: MultisigCosignatoryModification[],
        verifiers: MultisigCosignatoryModification[],
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo
    ): ModifyContractTransaction {
        return new ModifyContractTransaction(
            TransactionType.MODIFY_CONTRACT,
            networkType,
            deadline,
            durationDelta,
            hash,
            customers,
            executors,
            verifiers,
            maxFee,
            signature,
            signer,
            transactionInfo);
    }

    private constructor(
        transactionType: number,
        networkType: NetworkType,
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
        super(transactionType, networkType, TransactionVersion.MODIFY_CONTRACT, deadline, maxFee, signature, signer, transactionInfo);
        this.durationDelta = durationDelta;
        this.hash = hash;
        this.customers = customers;
        this.executors = executors;
        this.verifiers = verifiers;
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
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
