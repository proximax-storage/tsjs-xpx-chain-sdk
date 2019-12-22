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
import { Builder } from '../../infrastructure/builders/ExchangeOfferTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { ExchangeOffer } from './ExchangeOffer';

export class ExchangeOfferTransaction extends Transaction {

    /**
     * Create ExchangeOfferTransaction object
     * @returns {ExchangeOfferTransaction}
     */
    public static create(
            deadline: Deadline,
            offers: ExchangeOffer[],
            networkType: NetworkType,
            maxFee?: UInt64): ExchangeOfferTransaction {
        return new ExchangeOfferTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .offers(offers)
            .build();
    }

    public offers: ExchangeOffer[];

    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        offers: ExchangeOffer[],
        maxFee: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(TransactionType.EXCHANGE_OFFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.offers = offers || [];
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof ExchangeOfferTransaction
     */
    public get size(): number {
        return ExchangeOfferTransaction.calculateSize(this.offers.length);
    }

    public static calculateSize(offersLength: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 1 // num offers
            + offersLength*(8 + 8 + 8 + 1 + 32);

        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof ExchangeOfferTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                offers: this.offers.map(offer => offer.toDTO())
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
            .addOffers(this.offers.map(offer => ({
                mosaicId: offer.mosaicId.id.toDTO(),
                mosaicAmount: offer.mosaicAmount.toDTO(),
                cost: offer.cost.toDTO(),
                type: offer.type,
                owner: offer.owner.publicKey
            })))
            .build();
    }
}

export class ExchangeOfferTransactionBuilder extends TransactionBuilder {
    private _offers: ExchangeOffer[];

    public offers(offers: ExchangeOffer[]) {
        this._offers = offers;
        return this;
    }

    public build(): ExchangeOfferTransaction {
        return new ExchangeOfferTransaction(
            this._networkType,
            this._version || TransactionVersion.EXCHANGE_OFFER,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._offers,
            this._maxFee ? this._maxFee : calculateFee(ExchangeOfferTransaction.calculateSize(this._offers.length), this._feeCalculationStrategy),
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
