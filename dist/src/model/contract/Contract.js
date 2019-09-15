"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const UInt64_1 = require("../UInt64");
/**
 * The contract structure stores a supercontract definition as returned from http contractApi.
 * The contract can be created on blockachain using ModifyContractTransaction
 */
class Contract {
    constructor(multisig, multisigAddress, start, duration, hash, customers, executors, verifiers) {
        this.multisig = multisig;
        this.multisigAddress = multisigAddress;
        this.start = start;
        this.duration = duration;
        this.hash = hash;
        this.customers = customers;
        this.executors = executors;
        this.verifiers = verifiers;
    }
    static createFromDTO(contractDTO) {
        return new Contract(contractDTO.multisig, contractDTO.multisigAddress, new UInt64_1.UInt64(contractDTO.start), new UInt64_1.UInt64(contractDTO.duration), contractDTO.hash, contractDTO.customers, contractDTO.executors, contractDTO.verifiers);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=Contract.js.map