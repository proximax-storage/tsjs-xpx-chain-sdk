// Copyright 2022 ProximaX Limited. All rights reserved.
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
import { Builder } from '../../infrastructure/builders/PlaceSdaExchangeOfferTransaction';
import { TransactionType } from './TransactionType';
import { calculateFee } from './FeeCalculationStrategy';
import { SdaExchangeOffer } from './SdaExchangeOffer';

export class PlaceSdaExchangeOfferTransaction extends Transaction {

    offers: SdaExchangeOffer[];
    
    /**
     * Create PlaceSdaExchangeOfferTransaction object
     * @returns {PlaceSdaExchangeOfferTransaction}
     */
    public static create(
            deadline: Deadline,
            sdaExchangeOffers: SdaExchangeOffer[],
            networkType: NetworkType,
            maxFee?: UInt64): PlaceSdaExchangeOfferTransaction {
        return new PlaceSdaExchangeOfferTransactionBuilder()
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
        sdaExchangeOffers: SdaExchangeOffer[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        super(TransactionType.PLACE_SDA_EXCHANGE_OFFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.offers = sdaExchangeOffers || [];
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof PlaceSdaExchangeOfferTransaction
     */
    public get size(): number {
        return PlaceSdaExchangeOfferTransaction.calculateSize(this.offers.length);
    }

    public static calculateSize(offersCount: number): number {
        const byteSize = Transaction.getHeaderSize()
            + 1
            + ( offersCount * (8 + 8 + 8 + 8 + 8 ));
            // mosaicId give -8
            // mosaicId give amount -8
            // mosaicId get - 8
            // mosaicId get amount - 8
            // duration - 8

        return byteSize;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof PlaceSdaExchangeOfferTransaction
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

export class PlaceSdaExchangeOfferTransactionBuilder extends TransactionBuilder {
    private _offers: SdaExchangeOffer[];

    public offers(sdaExchangeOffers: SdaExchangeOffer[]) {
        this._offers = sdaExchangeOffers;
        return this;
    }

    public build(): PlaceSdaExchangeOfferTransaction {
        return new PlaceSdaExchangeOfferTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.PLACE_SDA_EXCHANGE_OFFER,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(PlaceSdaExchangeOfferTransaction.calculateSize(this._offers.length), this._feeCalculationStrategy),
            this._offers,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
