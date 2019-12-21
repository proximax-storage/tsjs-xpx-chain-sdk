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
import { Builder } from '../../infrastructure/builders/AddExchangeOfferTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { AddExchangeOffer } from './AddExchangeOffer';

export class AddExchangeOfferTransaction extends Transaction {

    /**
     * Create AddExchangeOfferTransaction object
     * @returns {AddExchangeOfferTransaction}
     */
    public static create(
            deadline: Deadline,
            offers: AddExchangeOffer[],
            networkType: NetworkType,
            maxFee?: UInt64): AddExchangeOfferTransaction {
        return new AddExchangeOfferTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .offers(offers)
            .build();
    }

    public offers: AddExchangeOffer[];

    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        offers: AddExchangeOffer[],
        maxFee: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(TransactionType.ADD_EXCHANGE_OFFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.offers = offers || [];
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof AddExchangeOfferTransaction
     */
    public get size(): number {
        return AddExchangeOfferTransaction.calculateSize(this.offers.length);
    }

    public static calculateSize(offersLength: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 1 // num offers
            + offersLength*(8 + 8 + 8 + 1 + 8 /* 33 */);

        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AddExchangeOfferTransaction
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
                duration: offer.duration.toDTO()
            })))
            .build();
    }
}

export class AddExchangeOfferTransactionBuilder extends TransactionBuilder {
    private _offers: AddExchangeOffer[];
    public offers(offers: AddExchangeOffer[]) {
        this._offers = offers;
        return this;
    }

    public build(): AddExchangeOfferTransaction {
        return new AddExchangeOfferTransaction(
            this._networkType,
            this._version || TransactionVersion.ADD_EXCHANGE_OFFER,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._offers,
            this._maxFee ? this._maxFee : calculateFee(AddExchangeOfferTransaction.calculateSize(this._offers.length), this._feeCalculationStrategy),
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
