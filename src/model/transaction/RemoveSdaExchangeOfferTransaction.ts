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
import { Builder } from '../../infrastructure/builders/RemoveSdaExchangeOfferTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { RemoveSdaExchangeOffer } from './RemoveSdaExchangeOffer';

export class RemoveSdaExchangeOfferTransaction extends Transaction {

    sdaExchangeOffers: RemoveSdaExchangeOffer[];

    /**
     * Create RemoveSdaExchangeOfferTransaction object
     * @returns {RemoveSdaExchangeOfferTransaction}
     */
    public static create(
            deadline: Deadline,
            sdaExchangeOffers: RemoveSdaExchangeOffer[],
            networkType: NetworkType,
            maxFee?: UInt64): RemoveSdaExchangeOfferTransaction {
        return new RemoveSdaExchangeOfferTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .sdaExchangeOffers(sdaExchangeOffers)
            .build();
    }

    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        sdaExchangeOffers: RemoveSdaExchangeOffer[],
        maxFee: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(TransactionType.REMOVE_SDA_EXCHANGE_OFFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.sdaExchangeOffers = sdaExchangeOffers || [];
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof RemoveSdaExchangeOfferTransaction
     */
    public get size(): number {
        return RemoveSdaExchangeOfferTransaction.calculateSize(this.sdaExchangeOffers.length);
    }

    public static calculateSize(offersLength: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 1 // num offers
            + offersLength*(8 + 8);
            // mosaicIdGive - 8
            // mosiacIdGet - 8

        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof RemoveSdaExchangeOfferTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                sdaExchangeOffers: this.sdaExchangeOffers.map(offer => offer.toDTO())
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
            .addSdaExchangeOffers(this.sdaExchangeOffers)
            .build();
    }
}

export class RemoveSdaExchangeOfferTransactionBuilder extends TransactionBuilder {
    private _sdaExchangeOffers: RemoveSdaExchangeOffer[];

    public sdaExchangeOffers(_sdaExchangeOffers: RemoveSdaExchangeOffer[]) {
        this._sdaExchangeOffers = _sdaExchangeOffers;
        return this;
    }

    public build(): RemoveSdaExchangeOfferTransaction {
        return new RemoveSdaExchangeOfferTransaction(
            this._networkType,
            this._version || TransactionVersion.REMOVE_SDA_EXCHANGE_OFFER,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._sdaExchangeOffers,
            this._maxFee ? this._maxFee : calculateFee(RemoveSdaExchangeOfferTransaction.calculateSize(this._sdaExchangeOffers.length), this._feeCalculationStrategy),
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
