// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Convert as convert } from '../../core/format/Convert';
import { TransactionType } from '../../model/transaction/TransactionType';
import ExchangeOfferTransactionBufferPackage from '../buffers/ExchangeOfferTransactionBuffer';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    ExchangeOfferTransactionBuffer,
    ExchangeOfferBuffer,
} = ExchangeOfferTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';
import ExchangeOfferTransactionSchema from '../schemas/ExchangeOfferTransactionSchema';

/**
 * @module transactions/ExchangeOfferTransaction
 */
export default class ExchangeOfferTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ExchangeOfferTransactionSchema);
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
        this.type = TransactionType.EXCHANGE_OFFER;
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
            const mosaicIdVector = ExchangeOfferBuffer
                .createMosaicIdVector(builder, offer.mosaicId);
            const mosaicAmountVector = ExchangeOfferBuffer
                .createMosaicAmountVector(builder, offer.mosaicAmount);
            const costVector = ExchangeOfferBuffer
                .createCostVector(builder, offer.cost);
            const ownerVector = ExchangeOfferBuffer
                .createOwnerVector(builder, convert.hexToUint8(offer.owner));
            ExchangeOfferBuffer.startExchangeOfferBuffer(builder);
            ExchangeOfferBuffer.addMosaicId(builder, mosaicIdVector);
            ExchangeOfferBuffer.addMosaicAmount(builder, mosaicAmountVector);
            ExchangeOfferBuffer.addCost(builder, costVector);
            ExchangeOfferBuffer.addType(builder, offer.type);
            ExchangeOfferBuffer.addOwner(builder, ownerVector);
            offersArray.push(ExchangeOfferBuffer.endExchangeOfferBuffer(builder));
        });

        // Create vectors
        const signatureVector = ExchangeOfferTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = ExchangeOfferTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = ExchangeOfferTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = ExchangeOfferTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const offersVector = ExchangeOfferTransactionBuffer
            .createOffersVector(builder, offersArray);
        ExchangeOfferTransactionBuffer.startExchangeOfferTransactionBuffer(builder);
        ExchangeOfferTransactionBuffer.addSize(builder, this.size);
        ExchangeOfferTransactionBuffer.addSignature(builder, signatureVector);
        ExchangeOfferTransactionBuffer.addSigner(builder, signerVector);
        ExchangeOfferTransactionBuffer.addVersion(builder, this.version);
        ExchangeOfferTransactionBuffer.addType(builder, this.type);
        ExchangeOfferTransactionBuffer.addMaxFee(builder, feeVector);
        ExchangeOfferTransactionBuffer.addDeadline(builder, deadlineVector);
        ExchangeOfferTransactionBuffer.addOffersCount(builder, this.offers.length);
        ExchangeOfferTransactionBuffer.addOffers(builder, offersVector);

        // Calculate size
        const codedMosaicChangeSupply = ExchangeOfferTransactionBuffer.endExchangeOfferTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);

        const bytes = builder.asUint8Array();

        return new ExchangeOfferTransaction(bytes);
    }
}
