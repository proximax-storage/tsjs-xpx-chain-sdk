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
/**
 * Multisig cosignatory modifications are part of the NEM's multisig account system.
 * With a multisig cosignatory modification a cosignatory is added to or deleted from a multisig account.
 * Multisig cosignatory modifications are part of a modify multisig account transactions.
 *
 */
class MultisigCosignatoryModification {
    /**
     * Constructor
     * @param type
     * @param cosignatoryPublicAccount
     */
    constructor(
    /**
     * Multi-signature modification type.
     */
    type, 
    /**
     * Cosignatory public account.
     */
    cosignatoryPublicAccount) {
        this.type = type;
        this.cosignatoryPublicAccount = cosignatoryPublicAccount;
    }
    /**
     * @internal
     */
    toDTO() {
        return {
            cosignatoryPublicKey: this.cosignatoryPublicAccount.publicKey,
            type: this.type,
        };
    }
}
exports.MultisigCosignatoryModification = MultisigCosignatoryModification;
//# sourceMappingURL=MultisigCosignatoryModification.js.map