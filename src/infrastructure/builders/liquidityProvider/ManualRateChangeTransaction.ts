/*
 * Copyright 2023 ProximaX
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module transactions/ManualRateChangeTransaction
 */
import { Convert as convert } from '../../../core/format';
import {ManualRateChangeBuffer} from '../../buffers/liquidityProvider/ManualRateChangeBuffer';
import ManualRateChangeTransactionSchema from '../../schemas/liquidityProvider/ManualRateChangeTransactionSchema';
import {VerifiableTransaction} from '../VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export default class ManualRateChangeTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ManualRateChangeTransactionSchema);
    }
}

export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    providerMosaicId: number[];
    currencyBalanceIncrease: boolean;
    currencyBalanceChange: number[];
    mosaicBalanceIncrease: boolean;
    mosaicBalanceChange: number[];

    constructor() {
        this.fee = [0, 0];
        this.version = 1;
    }

    addSize(size: number) {
        this.size = size;
        return this;
    }

    addMaxFee(fee: number[]) {
        this.fee = fee;
        return this;
    }

    addVersion(version: number) {
        this.version = version;
        return this;
    }

    addType(type: number) {
        this.type = type;
        return this;
    }

    addDeadline(deadline: number[]) {
        this.deadline = deadline;
        return this;
    }

    addProviderMosaicId(providerMosaicId: number[]) {
        this.providerMosaicId = providerMosaicId;
        return this;
    }

    addCurrencyBalanceIncrease(currencyBalanceIncrease: boolean) {
        this.currencyBalanceIncrease = currencyBalanceIncrease;
        return this;
    }

    addCurrencyBalanceChange(currencyBalanceChange: number[]) {
        this.currencyBalanceChange = currencyBalanceChange;
        return this;
    }

    addMosaicBalanceIncrease(mosaicBalanceIncrease: boolean) {
        this.mosaicBalanceIncrease = mosaicBalanceIncrease;
        return this;
    }

    addMosaicBalanceChange(mosaicBalanceChange: number[]) {
        this.mosaicBalanceChange = mosaicBalanceChange;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);
        const providerMosaicIdUint32 = new Uint32Array(this.providerMosaicId);

        // Create vectors
        const signatureVector = ManualRateChangeBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = ManualRateChangeBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = ManualRateChangeBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = ManualRateChangeBuffer.createMaxFeeVector(builder, this.fee);
        const providerMosaicIdVector = ManualRateChangeBuffer.createProviderMosaicIdVector(builder, providerMosaicIdUint32);
        const currencyBalanceChangeVector = ManualRateChangeBuffer.createCurrencyBalanceChangeVector(builder, this.currencyBalanceChange);
        const mosaicBalanceChangeVector = ManualRateChangeBuffer.createMosaicBalanceChangeVector(builder, this.mosaicBalanceChange);

        ManualRateChangeBuffer.startManualRateChangeBuffer(builder);
        ManualRateChangeBuffer.addSize(builder, this.size);
        ManualRateChangeBuffer.addSignature(builder, signatureVector);
        ManualRateChangeBuffer.addSigner(builder, signerVector);
        ManualRateChangeBuffer.addVersion(builder, this.version);
        ManualRateChangeBuffer.addType(builder, this.type);
        ManualRateChangeBuffer.addMaxFee(builder, feeVector);
        ManualRateChangeBuffer.addDeadline(builder, deadlineVector);
        ManualRateChangeBuffer.addProviderMosaicId(builder, providerMosaicIdVector);
        ManualRateChangeBuffer.addCurrencyBalanceIncrease(builder, this.currencyBalanceIncrease);
        ManualRateChangeBuffer.addCurrencyBalanceChange(builder, currencyBalanceChangeVector);
        ManualRateChangeBuffer.addMosaicBalanceIncrease(builder, this.mosaicBalanceIncrease);    
        ManualRateChangeBuffer.addMosaicBalanceChange(builder, mosaicBalanceChangeVector);

        const codedTransfer = ManualRateChangeBuffer.endManualRateChangeBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new ManualRateChangeTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}