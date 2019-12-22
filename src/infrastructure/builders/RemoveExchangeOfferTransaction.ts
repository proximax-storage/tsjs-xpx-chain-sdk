// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { TransactionType } from '../../model/transaction/TransactionType';
import ExchangeOfferTransactionBufferPackage from '../buffers/ExchangeOfferTransactionBuffer';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    RemoveExchangeOfferTransactionBuffer,
    RemoveExchangeOfferBuffer,
} = ExchangeOfferTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';
import RemoveExchangeOfferTransactionSchema from '../schemas/RemoveExchangeOfferTransactionSchema';

/**
 * @module transactions/RemoveExchangeOfferTransaction
 */
export default class RemoveExchangeOfferTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, RemoveExchangeOfferTransactionSchema);
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
        this.type = TransactionType.REMOVE_EXCHANGE_OFFER;
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
            const mosaicIdVector = RemoveExchangeOfferBuffer
                .createMosaicIdVector(builder, offer.mosaicId);
            RemoveExchangeOfferBuffer.startRemoveExchangeOfferBuffer(builder);
            RemoveExchangeOfferBuffer.addMosaicId(builder, mosaicIdVector);
            RemoveExchangeOfferBuffer.addType(builder, offer.offerType);
            offersArray.push(RemoveExchangeOfferBuffer.endRemoveExchangeOfferBuffer(builder));
        });

        // Create vectors
        const signatureVector = RemoveExchangeOfferTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = RemoveExchangeOfferTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = RemoveExchangeOfferTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = RemoveExchangeOfferTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const offersVector = RemoveExchangeOfferTransactionBuffer
            .createOffersVector(builder, offersArray);
        RemoveExchangeOfferTransactionBuffer.startRemoveExchangeOfferTransactionBuffer(builder);
        RemoveExchangeOfferTransactionBuffer.addSize(builder, this.size);
        RemoveExchangeOfferTransactionBuffer.addSignature(builder, signatureVector);
        RemoveExchangeOfferTransactionBuffer.addSigner(builder, signerVector);
        RemoveExchangeOfferTransactionBuffer.addVersion(builder, this.version);
        RemoveExchangeOfferTransactionBuffer.addType(builder, this.type);
        RemoveExchangeOfferTransactionBuffer.addMaxFee(builder, feeVector);
        RemoveExchangeOfferTransactionBuffer.addDeadline(builder, deadlineVector);
        RemoveExchangeOfferTransactionBuffer.addOffersCount(builder, this.offers.length);
        RemoveExchangeOfferTransactionBuffer.addOffers(builder, offersVector);

        // Calculate size
        const codedMosaicChangeSupply = RemoveExchangeOfferTransactionBuffer.endRemoveExchangeOfferTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);

        const bytes = builder.asUint8Array();

        return new RemoveExchangeOfferTransaction(bytes);
    }
}
