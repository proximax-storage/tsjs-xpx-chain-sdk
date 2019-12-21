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
import { Builder } from '../../infrastructure/builders/RemoveExchangeOfferTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { RemoveExchangeOffer } from './RemoveExchangeOffer';

export class RemoveExchangeOfferTransaction extends Transaction {

    /**
     * Create RemoveExchangeOfferTransaction object
     * @returns {RemoveExchangeOfferTransaction}
     */
    public static create(
            deadline: Deadline,
            offers: RemoveExchangeOffer[],
            networkType: NetworkType,
            maxFee?: UInt64): RemoveExchangeOfferTransaction {
        return new RemoveExchangeOfferTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .offers(offers)
            .build();
    }

    public offers: RemoveExchangeOffer[];

    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        offers: RemoveExchangeOffer[],
        maxFee: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(TransactionType.REMOVE_EXCHANGE_OFFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.offers = offers || [];
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof RemoveExchangeOfferTransaction
     */
    public get size(): number {
        return RemoveExchangeOfferTransaction.calculateSize(this.offers.length);
    }

    public static calculateSize(offersLength: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 1 // num offers
            + offersLength*(8 + 1);

        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof RemoveExchangeOfferTransaction
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
                offerType: offer.offerType
            })))
            .build();
    }
}

export class RemoveExchangeOfferTransactionBuilder extends TransactionBuilder {
    private _offers: RemoveExchangeOffer[];

    public offers(offers: RemoveExchangeOffer[]) {
        this._offers = offers;
        return this;
    }

    public build(): RemoveExchangeOfferTransaction {
        return new RemoveExchangeOfferTransaction(
            this._networkType,
            this._version || TransactionVersion.REMOVE_EXCHANGE_OFFER,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._offers,
            this._maxFee ? this._maxFee : calculateFee(RemoveExchangeOfferTransaction.calculateSize(this._offers.length), this._feeCalculationStrategy),
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
