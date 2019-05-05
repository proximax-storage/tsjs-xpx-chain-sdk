/*
 * Copyright 2019 NEM
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

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {EncryptedMessage} from '../../../src/model/transaction/EncryptedMessage';
import { TestingAccount } from '../../conf/conf.spec';
import { NetworkType, PublicAccount } from '../../../src/model/model';

describe('EncryptedMessage', () => {

    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should create a encrypted message from a DTO', () => {
        const encryptedMessage = EncryptedMessage.createFromDTO('test transaction');
        expect(encryptedMessage.payload).to.be.equal('test transaction');
    });

    it('should return encrypted message dto', () => {;
        const encryptedMessage = account.encryptMessage('test transaction', account.publicAccount);
        const plainMessage = account.decryptMessage(encryptedMessage, account.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });

    it('should create an encrypted message from a DTO and decrypt it', () => {
        const encryptMessage = EncryptedMessage
            .createFromDTO('56D274D6F78F85FA0B9390C24C9378A4593691F0E57EB0EF41C7374D0918E0E4164BA09C47A01295' +
                           'ABAEC2D579BEC52DBEFA31204F06B67CCD2C0F57CBFB6D237E1B70834B600E19465C8153FAD3203B');
        const plainMessage = account.decryptMessage(encryptMessage, account.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });

    it('shoulda', () => {
        const encryptMessage = EncryptedMessage
            .createFromDTO('2BD9DAF45E1248FBC3BE8A6413E44B03797763E54124053E4669BBC00553AA4ED2AC04CD7CCD5981' +
                           'C12CB14DCBC689CC9D467A0231F94A50212695E38DDD13A04E451032DD2677CBFC24637A2D17F8A9');
        const sender = PublicAccount.createFromPublicKey('A36DF1F0B64C7FF71499784317C8D63FB1DB8E1909519AB72051D2BE77A1EF45', NetworkType.TEST_NET);
        const recipient = Account.createFromPrivateKey('6556da78c063e0547b7fd2e8a8b66ba09b8f28043235fea441414f0fc591f507', NetworkType.TEST_NET);
        const plainMessage = recipient.decryptMessage(encryptMessage, sender);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });
});
