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
const Account_1 = require("../../src/model/account/Account");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
// TODO: configuration switch from command-line/npm "target"
exports.TestingAccount = Account_1.Account.createFromPrivateKey('26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930', NetworkType_1.NetworkType.MIJIN_TEST);
exports.MultisigAccount = Account_1.Account.createFromPrivateKey('5edebfdbeb32e9146d05ffd232c8af2cf9f396caf9954289daa0362d097fff3b', NetworkType_1.NetworkType.MIJIN_TEST);
exports.CosignatoryAccount = Account_1.Account.createFromPrivateKey('2a2b1f5d366a5dd5dc56c3c757cf4fe6c66e2787087692cf329d7a49a594658b', NetworkType_1.NetworkType.MIJIN_TEST);
exports.Cosignatory2Account = Account_1.Account.createFromPrivateKey('b8afae6f4ad13a1b8aad047b488e0738a437c7389d4ff30c359ac068910c1d59', NetworkType_1.NetworkType.MIJIN_TEST);
exports.Cosignatory3Account = Account_1.Account.createFromPrivateKey('111602be4d36f92dd60ca6a3c68478988578f26f6a02f8c72089839515ab603e', NetworkType_1.NetworkType.MIJIN_TEST);
exports.Customer1Account = Account_1.Account.createFromPrivateKey('c2b069398cc135645fa0959708ad2504f3dcfdb12a8b95c015ecbd16e29aeb77', NetworkType_1.NetworkType.TEST_NET);
exports.Executor1Account = Account_1.Account.createFromPrivateKey('0e02cce89fb87546f21b0b594461dcbea8b0a33743095870c3a1cd914e38be62', NetworkType_1.NetworkType.TEST_NET);
exports.Verifier1Account = Account_1.Account.createFromPrivateKey('c8a449299d45b26e4679b5fdd8e39a73fccd74f77444a8bf68d2893a93d29770', NetworkType_1.NetworkType.TEST_NET);
//# sourceMappingURL=conf.spec.js.map