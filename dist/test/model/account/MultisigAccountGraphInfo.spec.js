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
const assert_1 = require("assert");
const chai_1 = require("chai");
const MultisigAccountGraphInfo_1 = require("../../../src/model/account/MultisigAccountGraphInfo");
const MultisigAccountInfo_1 = require("../../../src/model/account/MultisigAccountInfo");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
describe('MultisigAccountGraphInfo', () => {
    it('should createComplete an MultisigAccountGraphInfo object', () => {
        const multisigAccountGraphInfoDTO = {
            level: 2,
            multisigEntries: [
                {
                    multisig: {
                        account: PublicAccount_1.PublicAccount.createFromPublicKey('B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D', NetworkType_1.NetworkType.MIJIN_TEST),
                        cosignatories: [
                            PublicAccount_1.PublicAccount.createFromPublicKey('CF893FFCC47C33E7F68AB1DB56365C156B0736824A0C1E273F9E00B8DF8F01EB', NetworkType_1.NetworkType.MIJIN_TEST),
                            PublicAccount_1.PublicAccount.createFromPublicKey('68B3FBB18729C1FDE225C57F8CE080FA828F0067E451A3FD81FA628842B0B763', NetworkType_1.NetworkType.MIJIN_TEST),
                            PublicAccount_1.PublicAccount.createFromPublicKey('DAB1C38C3E1642494FCCB33138B95E81867B5FB59FC4277A1D53761C8B9F6D14', NetworkType_1.NetworkType.MIJIN_TEST),
                        ],
                        minApproval: 3,
                        minRemoval: 3,
                        multisigAccounts: [
                            PublicAccount_1.PublicAccount.createFromPublicKey('1674016C27FE2C2EB5DFA73996FA54A183B38AED0AA64F756A3918BAF08E061B', NetworkType_1.NetworkType.MIJIN_TEST),
                        ],
                    },
                },
            ],
        };
        const multisigAccounts = new Map();
        multisigAccounts.set(multisigAccountGraphInfoDTO.level, multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
            return new MultisigAccountInfo_1.MultisigAccountInfo(multisigAccountInfoDTO.multisig.account, multisigAccountInfoDTO.multisig.minApproval, multisigAccountInfoDTO.multisig.minRemoval, multisigAccountInfoDTO.multisig.cosignatories, multisigAccountInfoDTO.multisig.multisigAccounts);
        }));
        const multisigAccountInfoGraph = new MultisigAccountGraphInfo_1.MultisigAccountGraphInfo(multisigAccounts);
        chai_1.expect(multisigAccountInfoGraph.multisigAccounts.get(2)).to.not.be.equal(undefined);
        chai_1.expect(multisigAccountInfoGraph.multisigAccounts.get(1)).to.be.equal(undefined);
        chai_1.expect(multisigAccountInfoGraph.multisigAccounts.get(2)[0].account)
            .to.be.equal(multisigAccountGraphInfoDTO.multisigEntries[0].multisig.account);
        chai_1.expect(multisigAccountInfoGraph.multisigAccounts.get(2)[0].minApproval)
            .to.be.equal(multisigAccountGraphInfoDTO.multisigEntries[0].multisig.minApproval);
        chai_1.expect(multisigAccountInfoGraph.multisigAccounts.get(2)[0].minRemoval)
            .to.be.equal(multisigAccountGraphInfoDTO.multisigEntries[0].multisig.minRemoval);
        assert_1.deepEqual(multisigAccountInfoGraph.multisigAccounts.get(2)[0].cosignatories, multisigAccountGraphInfoDTO.multisigEntries[0].multisig.cosignatories);
        assert_1.deepEqual(multisigAccountInfoGraph.multisigAccounts.get(2)[0].multisigAccounts, multisigAccountGraphInfoDTO.multisigEntries[0].multisig.multisigAccounts);
    });
    describe('hasCosigner', () => {
        it('should return true when account is in the cosignatories list', () => {
        });
        it('should return false when account is not in the cosignatories list', () => {
        });
    });
    describe('isCosignerOfMultisigAccount', () => {
        it('should return true when account is in the multisig account list', () => {
        });
        it('should return false when account is not in the multisig account list', () => {
        });
    });
});
//# sourceMappingURL=MultisigAccountGraphInfo.spec.js.map