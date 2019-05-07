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
import { NetworkType, PublicAccount } from '../../../src/model/model';
import {EncryptedMessage} from '../../../src/model/transaction/EncryptedMessage';

describe('EncryptedMessage', () => {

    let sender: Account;
    let recipient: Account;

    before(() => {
        // Catapult-server-bootstrap generated account
        sender = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108',
                                              NetworkType.MIJIN_TEST);
        recipient = Account.createFromPrivateKey('B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
                                              NetworkType.MIJIN_TEST);
    });

    it('should create a encrypted message from a DTO', () => {
        const hexedEncrypted = 'E593C1F7248CC7012E58624CCE2CF498AC441968CF447DE6641842BD5A9DB9BBD96277AB09153CC64EBE72865BA4213A95EF7D20A5BD2F9EB7BDF25C15C52FD9979598DDD59575045C033C196B167529';
        const encryptedMessage = EncryptedMessage.createFromPayload(hexedEncrypted);
        expect(encryptedMessage.payload).to.be.equal(hexedEncrypted); // As DTO returns Hexed payload
    });

    it('should return encrypted message dto', () => {
        const encryptedMessage = sender.encryptMessage('test transaction', recipient.publicAccount);
        const plainMessage = recipient.decryptMessage(encryptedMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });

    it('should decrypt message from raw encrypted message payload', () => {
        const payload = 'AE044953E4FF05BC3C14AA10B367E8563D8929680C0D75DBC180F9A7B927D335E66C3BA94266408B366F88B1E503EB' +
                               '4A3730D9B2F16F1FC16E335262A701CC786E6739A38880A6788530A9E8E4D13C7F';
        const plainMessage = recipient.decryptMessage(new EncryptedMessage(payload), sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });

    it('should create an encrypted message from a DTO and decrypt it', () => {
        // message payload generated from catapult-server
        const encryptMessage = EncryptedMessage.createFromPayload('AE044953E4FF05BC3C14AA10B367E8563D8929680C0D75DBC180F9A7B927D335E66C3BA94266408B366F88B1E503EB' +
                                '4A3730D9B2F16F1FC16E335262A701CC786E6739A38880A6788530A9E8E4D13C7F');
        const plainMessage = recipient.decryptMessage(encryptMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });

    it('should decrypt message encrypted in java sdk', () => {
        const encryptMessage = new EncryptedMessage(
                           '2BD9DAF45E1248FBC3BE8A6413E44B03797763E54124053E4669BBC00553AA4ED2AC04CD7CCD5981' + 
                           'C12CB14DCBC689CC9D467A0231F94A50212695E38DDD13A04E451032DD2677CBFC24637A2D17F8A9');                           
        const sender = PublicAccount.createFromPublicKey('A36DF1F0B64C7FF71499784317C8D63FB1DB8E1909519AB72051D2BE77A1EF45', NetworkType.TEST_NET);
        const recipient = Account.createFromPrivateKey('6556da78c063e0547b7fd2e8a8b66ba09b8f28043235fea441414f0fc591f507', NetworkType.TEST_NET);
        const plainMessage = recipient.decryptMessage(encryptMessage, sender);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });
});
