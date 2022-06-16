// Copyright 2022 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Convert as convert} from '../../core/format';
import { VerifiableTransaction } from './VerifiableTransaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import PlaceSdaExchangeOfferTransactionSchema from '../schemas/PlaceSdaExchangeOfferTransactionSchema';
import {PlaceSdaExchangeOfferTransactionBuffer} from '../buffers/PlaceSdaExchangeOfferTransactionBuffer';
import {PlaceSdaExchangeOfferBuffer} from '../buffers/PlaceSdaExchangeOfferBuffer';
import {SdaExchangeOffer} from "../../model/transaction/SdaExchangeOffer"

const { flatbuffers } = require('flatbuffers');

/**
 * @module transactions/PlaceSdaExchangeOfferTransaction
 */
export default class PlaceSdaExchangeOfferTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, PlaceSdaExchangeOfferTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    sdaExchangeOffers: SdaExchangeOffer[];

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.PLACE_SDA_EXCHANGE_OFFER;
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

    addSdaExchangeOffers(offers) {
        this.sdaExchangeOffers = offers;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);
        // Constants

        // Create offers
        const offersArray:any[] = [];
        this.sdaExchangeOffers.forEach(offer => {
            const mosaicIdGiveVector = PlaceSdaExchangeOfferBuffer
                .createMosaicIdGiveVector(builder, offer.mosaicIdGive.id.toDTO());
            const mosaicAmountGiveVector = PlaceSdaExchangeOfferBuffer
                .createMosaicAmountGiveVector(builder, offer.mosaicAmountGive.toDTO());
            const mosaicIdGetVector = PlaceSdaExchangeOfferBuffer
                .createMosaicIdGetVector(builder, offer.mosaicIdGet.id.toDTO());
            const mosaicAmountGetVector = PlaceSdaExchangeOfferBuffer
                .createMosaicAmountGetVector(builder, offer.mosaicAmountGet.toDTO());
            // const ownerVector = PlaceSdaExchangeOfferBuffer
                // .createOwnerVector(builder, convert.hexToUint8(offer.owner.publicKey));
            const durationVector = PlaceSdaExchangeOfferBuffer
                .createDurationVector(builder, offer.duration.toDTO());
            PlaceSdaExchangeOfferBuffer.startPlaceSdaExchangeOfferBuffer(builder);
            PlaceSdaExchangeOfferBuffer.addMosaicIdGive(builder, mosaicIdGiveVector);
            PlaceSdaExchangeOfferBuffer.addMosaicAmountGive(builder, mosaicAmountGiveVector);
            PlaceSdaExchangeOfferBuffer.addMosaicIdGet(builder, mosaicIdGetVector);
            PlaceSdaExchangeOfferBuffer.addMosaicAmountGet(builder, mosaicAmountGetVector);
            // PlaceSdaExchangeOfferBuffer.addOwner(builder, ownerVector);
            PlaceSdaExchangeOfferBuffer.addDuration(builder, durationVector);
            offersArray.push(PlaceSdaExchangeOfferBuffer.endPlaceSdaExchangeOfferBuffer(builder));
        });

        // Create vectors
        const signatureVector = PlaceSdaExchangeOfferTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = PlaceSdaExchangeOfferTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = PlaceSdaExchangeOfferTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = PlaceSdaExchangeOfferTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const offersVector = PlaceSdaExchangeOfferTransactionBuffer
            .createSdaOffersVector(builder, offersArray);
        PlaceSdaExchangeOfferTransactionBuffer.startPlaceSdaExchangeOfferTransactionBuffer(builder);
        PlaceSdaExchangeOfferTransactionBuffer.addSize(builder, this.size);
        PlaceSdaExchangeOfferTransactionBuffer.addSignature(builder, signatureVector);
        PlaceSdaExchangeOfferTransactionBuffer.addSigner(builder, signerVector);
        PlaceSdaExchangeOfferTransactionBuffer.addVersion(builder, this.version);
        PlaceSdaExchangeOfferTransactionBuffer.addType(builder, this.type);
        PlaceSdaExchangeOfferTransactionBuffer.addMaxFee(builder, feeVector);
        PlaceSdaExchangeOfferTransactionBuffer.addDeadline(builder, deadlineVector);
        PlaceSdaExchangeOfferTransactionBuffer.addSdaOfferCount(builder, this.sdaExchangeOffers.length);
        PlaceSdaExchangeOfferTransactionBuffer.addSdaOffers(builder, offersVector);

        // Calculate size
        const codedOffset = PlaceSdaExchangeOfferTransactionBuffer.endPlaceSdaExchangeOfferTransactionBuffer(builder);
        builder.finish(codedOffset);

        const bytes = builder.asUint8Array();

        return new PlaceSdaExchangeOfferTransaction(bytes);
    }
}
