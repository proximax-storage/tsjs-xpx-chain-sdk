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
const UInt64_1 = require("../UInt64");
const Transaction_1 = require("./Transaction");
const TransactionType_1 = require("./TransactionType");
const TransactionVersion_1 = require("./TransactionVersion");
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
    static create(deadline, mosaicId, direction, delta, networkType, maxFee = new UInt64_1.UInt64([0, 0])) {
        return new MosaicSupplyChangeTransaction(networkType, TransactionVersion_1.TransactionVersion.MOSAIC_SUPPLY_CHANGE, deadline, maxFee, mosaicId, direction, delta);
    }
    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicSupplyChangeTransaction
     * @returns {number}
     * @memberof MosaicSupplyChangeTransaction
     */
    get size() {
        const byteSize = super.size;
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
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addMosaicId(this.mosaicId.id.toDTO())
            .addDirection(this.direction)
            .addDelta(this.delta.toDTO())
            .build();
    }
}
exports.MosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction;
//# sourceMappingURL=MosaicSupplyChangeTransaction.js.map