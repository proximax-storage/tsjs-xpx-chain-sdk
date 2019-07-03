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
const chai_1 = require("chai");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MultisigCosignatoryModification_1 = require("../../../src/model/transaction/MultisigCosignatoryModification");
const MultisigCosignatoryModificationType_1 = require("../../../src/model/transaction/MultisigCosignatoryModificationType");
describe('MultisigCosignatoryModification', () => {
    it('should create Add MultisigCosignatoryModification', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add, PublicAccount_1.PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType_1.NetworkType.MIJIN_TEST));
        chai_1.expect(multisigCosignatoryModification.cosignatoryPublicAccount.publicKey)
            .to.be.equal('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB');
        chai_1.expect(multisigCosignatoryModification.type).to.be.equal(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add);
    });
    it('should create Add MultisigCosignatoryModification and get toDTO correctly', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add, PublicAccount_1.PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType_1.NetworkType.MIJIN_TEST)).toDTO();
        chai_1.expect(multisigCosignatoryModification.cosignatoryPublicKey)
            .to.be.equal('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB');
        chai_1.expect(multisigCosignatoryModification.type).to.be.equal(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Add);
    });
    it('should create Remove MultisigCosignatoryModification', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Remove, PublicAccount_1.PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType_1.NetworkType.MIJIN_TEST));
        chai_1.expect(multisigCosignatoryModification.cosignatoryPublicAccount.publicKey)
            .to.be.equal('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB');
        chai_1.expect(multisigCosignatoryModification.type).to.be.equal(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Remove);
    });
    it('should create Remove MultisigCosignatoryModification and get toDTO correctly', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification_1.MultisigCosignatoryModification(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Remove, PublicAccount_1.PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType_1.NetworkType.MIJIN_TEST)).toDTO();
        chai_1.expect(multisigCosignatoryModification.cosignatoryPublicKey)
            .to.be.equal('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB');
        chai_1.expect(multisigCosignatoryModification.type).to.be.equal(MultisigCosignatoryModificationType_1.MultisigCosignatoryModificationType.Remove);
    });
});
//# sourceMappingURL=MultisigCosignatoryModification.spec.js.map