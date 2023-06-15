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
 * @module transactions/CreateLiquidityProviderTransaction
 */
import { Convert as convert } from '../../../core/format';
import {CreateLiquidityProviderBuffer} from '../../buffers/liquidityProvider/CreateLiquidityProviderBuffer';
import CreateLiquidityProviderTransactionSchema from '../../schemas/liquidityProvider/CreateLiquidityProviderTransactionSchema';
import {VerifiableTransaction} from '../VerifiableTransaction';

import * as flatbuffers from 'flatbuffers';

export default class CreateLiquidityProviderTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, CreateLiquidityProviderTransactionSchema);
    }
}

export class Builder {
    size: number;
    fee: number[];
    version: number;
    type: number;
    deadline: number[];
    providerMosaicId: number[];
    currencyDeposit: number[];
    initialMosaicsMinting: number[];
    slashingPeriod: number; // uint32
    windowSize: number; // uint16
    slashingAccount: string;
    alpha: number; // uint32
    beta: number; // uint32

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

    addCurrencyDeposit(currencyDeposit: number[]) {
        this.currencyDeposit = currencyDeposit;
        return this;
    }

    addInitialMosaicsMinting(initialMosaicsMinting: number[]) {
        this.initialMosaicsMinting = initialMosaicsMinting;
        return this;
    }

    addSlashingPeriod(slashingPeriod: number) {
        this.slashingPeriod = slashingPeriod;
        return this;
    }

    addWindowSize(windowSize: number) {
        this.windowSize = windowSize;
        return this;
    }

    addSlashingAccount(slashingAccount: string) {
        this.slashingAccount = slashingAccount;
        return this;
    }

    addAlpha(alpha: number) {
        this.alpha = alpha;
        return this;
    }

    addBeta(beta: number) {
        this.beta = beta;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);
        const providerMosaicIdUint32 = new Uint32Array(this.providerMosaicId);

        // Create vectors
        const signatureVector = CreateLiquidityProviderBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = CreateLiquidityProviderBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = CreateLiquidityProviderBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = CreateLiquidityProviderBuffer.createMaxFeeVector(builder, this.fee);
        const slashingAccountVector = CreateLiquidityProviderBuffer.createSlashingAccountVector(builder, convert.hexToUint8(this.slashingAccount));
        const providerMosaicIdVector = CreateLiquidityProviderBuffer.createProviderMosaicIdVector(builder, providerMosaicIdUint32);
        const currencyDepositVector = CreateLiquidityProviderBuffer.createCurrencyDepositVector(builder, this.currencyDeposit);
        const initialMosaicsMintingVector = CreateLiquidityProviderBuffer.createInitialMosaicsMintingVector(builder, this.initialMosaicsMinting);

        CreateLiquidityProviderBuffer.startCreateLiquidityProviderBuffer(builder);
        CreateLiquidityProviderBuffer.addSize(builder, this.size);
        CreateLiquidityProviderBuffer.addSignature(builder, signatureVector);
        CreateLiquidityProviderBuffer.addSigner(builder, signerVector);
        CreateLiquidityProviderBuffer.addVersion(builder, this.version);
        CreateLiquidityProviderBuffer.addType(builder, this.type);
        CreateLiquidityProviderBuffer.addMaxFee(builder, feeVector);
        CreateLiquidityProviderBuffer.addDeadline(builder, deadlineVector);
        CreateLiquidityProviderBuffer.addProviderMosaicId(builder, providerMosaicIdVector);
        CreateLiquidityProviderBuffer.addCurrencyDeposit(builder, currencyDepositVector);
        CreateLiquidityProviderBuffer.addInitialMosaicsMinting(builder, initialMosaicsMintingVector);
        CreateLiquidityProviderBuffer.addSlashingPeriod(builder, this.slashingPeriod);    
        CreateLiquidityProviderBuffer.addWindowSize(builder, this.windowSize);
        CreateLiquidityProviderBuffer.addSlashingAccount(builder, slashingAccountVector);
        CreateLiquidityProviderBuffer.addAlpha(builder, this.alpha);
        CreateLiquidityProviderBuffer.addBeta(builder, this.beta);

        const codedTransfer = CreateLiquidityProviderBuffer.endCreateLiquidityProviderBuffer(builder);
        builder.finish(codedTransfer);

        const bytes = builder.asUint8Array();

        return new CreateLiquidityProviderTransaction(bytes);
    }

    static stringToUint8(stringToConvert: string): Uint8Array{
        return convert.hexToUint8(convert.utf8ToHex(stringToConvert));
    }
}