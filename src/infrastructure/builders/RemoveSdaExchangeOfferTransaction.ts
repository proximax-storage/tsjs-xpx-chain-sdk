// Copyright 2022 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { VerifiableTransaction } from './VerifiableTransaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import RemoveSdaExchangeOfferTransactionSchema from '../schemas/RemoveSdaExchangeOfferTransactionSchema';
import {RemoveSdaExchangeOfferTransactionBuffer} from '../buffers/RemoveSdaExchangeOfferTransactionBuffer';
import {RemoveSdaExchangeOfferBuffer} from '../buffers/RemoveSdaExchangeOfferBuffer';
import {RemoveSdaExchangeOffer} from "../../model/transaction/RemoveSdaExchangeOffer"

const { flatbuffers } = require('flatbuffers');

/**
 * @module transactions/RemoveSdaExchangeOfferTransaction
 */
export default class RemoveSdaExchangeOfferTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, RemoveSdaExchangeOfferTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    sdaExchangeOffers: RemoveSdaExchangeOffer[];

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.REMOVE_SDA_EXCHANGE_OFFER;
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

    addSdaExchangeOffers(sdaExchangeOffers: RemoveSdaExchangeOffer[]) {
        this.sdaExchangeOffers = sdaExchangeOffers;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);
        // Constants

        // Create offers
        const offersArray:any[] = [];
        this.sdaExchangeOffers.forEach(offer => {
            const mosaicIdGiveVector = RemoveSdaExchangeOfferBuffer
                .createMosaicIdGiveVector(builder, offer.mosaicIdGive.id.toDTO());
            const mosaicIdGetVector = RemoveSdaExchangeOfferBuffer
                .createMosaicIdGetVector(builder, offer.mosaicIdGet.id.toDTO());
            RemoveSdaExchangeOfferBuffer.startRemoveSdaExchangeOfferBuffer(builder);
            RemoveSdaExchangeOfferBuffer.addMosaicIdGive(builder, mosaicIdGiveVector);
            RemoveSdaExchangeOfferBuffer.addMosaicIdGet(builder, mosaicIdGetVector);
            offersArray.push(RemoveSdaExchangeOfferBuffer.endRemoveSdaExchangeOfferBuffer(builder));
        });

        // Create vectors
        const signatureVector = RemoveSdaExchangeOfferTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = RemoveSdaExchangeOfferTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = RemoveSdaExchangeOfferTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = RemoveSdaExchangeOfferTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const offersVector = RemoveSdaExchangeOfferTransactionBuffer
            .createSdaOffersVector(builder, offersArray);
        RemoveSdaExchangeOfferTransactionBuffer.startRemoveSdaExchangeOfferTransactionBuffer(builder);
        RemoveSdaExchangeOfferTransactionBuffer.addSize(builder, this.size);
        RemoveSdaExchangeOfferTransactionBuffer.addSignature(builder, signatureVector);
        RemoveSdaExchangeOfferTransactionBuffer.addSigner(builder, signerVector);
        RemoveSdaExchangeOfferTransactionBuffer.addVersion(builder, this.version);
        RemoveSdaExchangeOfferTransactionBuffer.addType(builder, this.type);
        RemoveSdaExchangeOfferTransactionBuffer.addMaxFee(builder, feeVector);
        RemoveSdaExchangeOfferTransactionBuffer.addDeadline(builder, deadlineVector);
        RemoveSdaExchangeOfferTransactionBuffer.addSdaOfferCount(builder, this.sdaExchangeOffers.length);
        RemoveSdaExchangeOfferTransactionBuffer.addSdaOffers(builder, offersVector);

        // Calculate size
        const codedOffset = RemoveSdaExchangeOfferTransactionBuffer.endRemoveSdaExchangeOfferTransactionBuffer(builder);
        builder.finish(codedOffset);

        const bytes = builder.asUint8Array();

        return new RemoveSdaExchangeOfferTransaction(bytes);
    }
}
