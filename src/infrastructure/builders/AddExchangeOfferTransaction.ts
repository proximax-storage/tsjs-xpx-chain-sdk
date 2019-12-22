// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { TransactionType } from '../../model/transaction/TransactionType';
import ExchangeOfferTransactionBufferPackage from '../buffers/ExchangeOfferTransactionBuffer';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    AddExchangeOfferTransactionBuffer,
    AddExchangeOfferBuffer,
} = ExchangeOfferTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';
import AddExchangeOfferTransactionSchema from '../schemas/AddExchangeOfferTransactionSchema';

/**
 * @module transactions/AddExchangeOfferTransaction
 */
export default class AddExchangeOfferTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AddExchangeOfferTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    offers: any[];

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.ADD_EXCHANGE_OFFER;
    }

    addSize(size) {
        this.size = size;
        return this;
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }

    addVersion(version) {
        this.version = version;
        return this;
    }

    addType(type) {
        this.type = type;
        return this;
    }

    addDeadline(deadline) {
        this.deadline = deadline;
        return this;
    }

    addOffers(offers) {
        this.offers = offers;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);
        // Constants

        // Create offers
        const offersArray:any[] = [];
        this.offers.forEach(offer => {
            const mosaicIdVector = AddExchangeOfferBuffer
                .createMosaicIdVector(builder, offer.mosaicId);
            const mosaicAmountVector = AddExchangeOfferBuffer
                .createMosaicAmountVector(builder, offer.mosaicAmount);
            const costVector = AddExchangeOfferBuffer
                .createCostVector(builder, offer.cost);
            const durationVector = AddExchangeOfferBuffer
                .createDurationVector(builder, offer.duration);
            AddExchangeOfferBuffer.startAddExchangeOfferBuffer(builder);
            AddExchangeOfferBuffer.addMosaicId(builder, mosaicIdVector);
            AddExchangeOfferBuffer.addMosaicAmount(builder, mosaicAmountVector);
            AddExchangeOfferBuffer.addCost(builder, costVector);
            AddExchangeOfferBuffer.addType(builder, offer.type);
            AddExchangeOfferBuffer.addDuration(builder, durationVector);
            offersArray.push(AddExchangeOfferBuffer.endAddExchangeOfferBuffer(builder));
        });

        // Create vectors
        const signatureVector = AddExchangeOfferTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AddExchangeOfferTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AddExchangeOfferTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AddExchangeOfferTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const offersVector = AddExchangeOfferTransactionBuffer
            .createOffersVector(builder, offersArray);
        AddExchangeOfferTransactionBuffer.startAddExchangeOfferTransactionBuffer(builder);
        AddExchangeOfferTransactionBuffer.addSize(builder, this.size);
        AddExchangeOfferTransactionBuffer.addSignature(builder, signatureVector);
        AddExchangeOfferTransactionBuffer.addSigner(builder, signerVector);
        AddExchangeOfferTransactionBuffer.addVersion(builder, this.version);
        AddExchangeOfferTransactionBuffer.addType(builder, this.type);
        AddExchangeOfferTransactionBuffer.addMaxFee(builder, feeVector);
        AddExchangeOfferTransactionBuffer.addDeadline(builder, deadlineVector);
        AddExchangeOfferTransactionBuffer.addOffersCount(builder, this.offers.length);
        AddExchangeOfferTransactionBuffer.addOffers(builder, offersVector);

        // Calculate size
        const codedMosaicChangeSupply = AddExchangeOfferTransactionBuffer.endAddExchangeOfferTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);

        const bytes = builder.asUint8Array();

        return new AddExchangeOfferTransaction(bytes);
    }
}
