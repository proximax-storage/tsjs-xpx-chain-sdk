"use strict";
/*
 * Copyright 2018 NEM
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
Object.defineProperty(exports, "__esModule", { value: true });
const MosaicSupplyChangeTransaction_1 = require("../../infrastructure/builders/MosaicSupplyChangeTransaction");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
const FeeCalculationStrategy_1 = require("./FeeCalculationStrategy");
/**
 * In case a mosaic has the flag 'supplyMutable' set to true, the creator of the mosaic can change the supply,
 * i.e. increase or decrease the supply.
 */
class MosaicSupplyChangeTransaction extends Transaction_1.Transaction {
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicId
     * @param direction
     * @param delta
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType, version, deadline, maxFee, 
    /**
     * The mosaic id.
     */
    mosaicId, 
    /**
     * The supply type.
     */
    direction, 
    /**
     * The supply change in units for the mosaic.
     */
    delta, signature, signer, transactionInfo) {
        super(TransactionType_1.TransactionType.MOSAIC_SUPPLY_CHANGE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.mosaicId = mosaicId;
        this.direction = direction;
        this.delta = delta;
    }
    /**
     * Create a mosaic supply change transaction object
     * @param deadline - The deadline to include the transaction.
     * @param mosaicId - The mosaic id.
     * @param direction - The supply type.
     * @param delta - The supply change in units for the mosaic.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicSupplyChangeTransaction}
     */
    static create(deadline, mosaicId, direction, delta, networkType, maxFee) {
        return new MosaicSupplyChangeTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .mosaicId(mosaicId)
            .direction(direction)
            .delta(delta)
            .build();
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicSupplyChangeTransaction
     * @returns {number}
     * @memberof MosaicSupplyChangeTransaction
     */
    get size() {
        return MosaicSupplyChangeTransaction.calculateSize();
    }
    static calculateSize() {
        const byteSize = Transaction_1.Transaction.getHeaderSize();
        // set static byte size fields
        const byteMosaicId = 8;
        const byteDirection = 1;
        const byteDelta = 8;
        return byteSize + byteMosaicId + byteDirection + byteDelta;
    }
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    buildTransaction() {
        return new MosaicSupplyChangeTransaction_1.Builder()
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addMosaicId(this.mosaicId.id.toDTO())
            .addDirection(this.direction)
            .addDelta(this.delta.toDTO())
            .build();
    }
}
exports.MosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction;
class MosaicSupplyChangeTransactionBuilder extends Transaction_1.TransactionBuilder {
    mosaicId(mosaicId) {
        this._mosaicId = mosaicId;
        return this;
    }
    direction(direction) {
        this._direction = direction;
        return this;
    }
    delta(delta) {
        this._delta = delta;
        return this;
    }
    build() {
        return new MosaicSupplyChangeTransaction(this._networkType, TransactionVersion_1.TransactionVersion.MOSAIC_SUPPLY_CHANGE, this._deadline ? this._deadline : this._createNewDeadlineFn(), this._maxFee ? this._maxFee : FeeCalculationStrategy_1.calculateFee(MosaicSupplyChangeTransaction.calculateSize(), this._feeCalculationStrategy), this._mosaicId, this._direction, this._delta, this._signature, this._signer, this._transactionInfo);
    }
}
exports.MosaicSupplyChangeTransactionBuilder = MosaicSupplyChangeTransactionBuilder;
//# sourceMappingURL=MosaicSupplyChangeTransaction.js.map