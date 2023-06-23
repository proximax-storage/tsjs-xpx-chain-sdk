// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionTypeVersion } from './TransactionTypeVersion';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Builder } from '../../infrastructure/builders/RemoveSdaExchangeOfferTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { RemoveSdaExchangeOffer } from './RemoveSdaExchangeOffer';

export class RemoveSdaExchangeOfferTransaction extends Transaction {

    offers: RemoveSdaExchangeOffer[];

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
            .offers(sdaExchangeOffers)
            .build();
    }

    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        sdaExchangeOffers: RemoveSdaExchangeOffer[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(TransactionType.REMOVE_SDA_EXCHANGE_OFFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.offers = sdaExchangeOffers || [];
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof RemoveSdaExchangeOfferTransaction
     */
    public get size(): number {
        return RemoveSdaExchangeOfferTransaction.calculateSize(this.offers.length);
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
                sdaExchangeOffers: this.offers.map(offer => offer.toDTO())
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
            .addOffers(this.offers)
            .build();
    }
}

export class RemoveSdaExchangeOfferTransactionBuilder extends TransactionBuilder {
    private _offers: RemoveSdaExchangeOffer[];

    public offers(_sdaExchangeOffers: RemoveSdaExchangeOffer[]) {
        this._offers = _sdaExchangeOffers;
        return this;
    }

    public build(): RemoveSdaExchangeOfferTransaction {
        return new RemoveSdaExchangeOfferTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.REMOVE_SDA_EXCHANGE_OFFER,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(RemoveSdaExchangeOfferTransaction.calculateSize(this._offers.length), this._feeCalculationStrategy),
            this._offers,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
