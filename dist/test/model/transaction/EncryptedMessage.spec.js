"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const crypto_1 = require("../../../src/core/crypto");
const Account_1 = require("../../../src/model/account/Account");
const model_1 = require("../../../src/model/model");
const EncryptedMessage_1 = require("../../../src/model/transaction/EncryptedMessage");
describe('EncryptedMessage', () => {
    let sender;
    let recipient;
    let sender_nis;
    let recipient_nis;
    before(() => {
        sender = Account_1.Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108', model_1.NetworkType.MIJIN_TEST);
        recipient = Account_1.Account.createFromPrivateKey('B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08', model_1.NetworkType.MIJIN_TEST);
        sender_nis = Account_1.Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108', model_1.NetworkType.MIJIN_TEST, crypto_1.SignSchema.KECCAK_REVERSED_KEY);
        recipient_nis = Account_1.Account.createFromPrivateKey('B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08', model_1.NetworkType.MIJIN_TEST, crypto_1.SignSchema.KECCAK_REVERSED_KEY);
    });
    it('should create a encrypted message from a DTO', () => {
        const encryptedMessage = EncryptedMessage_1.EncryptedMessage.createFromPayload('test transaction');
        chai_1.expect(encryptedMessage.payload).to.be.equal('test transaction'); // As DTO returns Hexed payload
    });
    it('should return encrypted message dto', () => {
        const encryptedMessage = sender.encryptMessage('test transaction', recipient.publicAccount);
        const plainMessage = recipient.decryptMessage(encryptedMessage, sender.publicAccount);
        chai_1.expect(plainMessage.payload).to.be.equal('test transaction');
    });
    it('should decrypt message from raw encrypted message payload', () => {
        const payload = 'EF6F9F6F8BEFD8BC1FAECD1E610CC195D87D667F401A5B4EA8F0398BDE0B0A2FA4543D7C5C2468D2' +
            'D478347FB856243F66b3c55321afe7471862d93392a9c57ef0646a045c3e038706de519b8392f4a2';
        const plainMessage = recipient.decryptMessage(new EncryptedMessage_1.EncryptedMessage(payload), sender.publicAccount);
        chai_1.expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });
    it('should return decrepted message reading from message payload', () => {
        const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const transferTransaction = model_1.TransferTransaction.create(model_1.Deadline.create(), recipient.address, [model_1.NetworkCurrencyMosaic.createAbsolute(1)], sender.encryptMessage('Testing simple transfer', recipient.publicAccount), model_1.NetworkType.MIJIN_TEST);
        const signedTransaction = transferTransaction.signWith(sender, generationHash);
        const encryptMessage = EncryptedMessage_1.EncryptedMessage
            .createFromPayload(signedTransaction.payload.substring(302, signedTransaction.payload.length - 32));
        const plainMessage = recipient.decryptMessage(encryptMessage, sender.publicAccount);
        chai_1.expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });
    it('should encrypt/decrypt message as in js library test', () => {
        const message = 'ProximaX is awesome !';
        const recipientPrivate = Account_1.Account.createFromPrivateKey('2618090794e9c9682f2ac6504369a2f4fb9fe7ee7746f9560aca228d355b1cb9', model_1.NetworkType.MAIN_NET);
        const recipientPublic = recipientPrivate.publicAccount;
        const senderPrivate = Account_1.Account.createFromPrivateKey('2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90', model_1.NetworkType.MAIN_NET);
        const senderPublic = senderPrivate.publicAccount;
        const encryptedMessage = senderPrivate.encryptMessage(message, recipientPublic);
        chai_1.expect(encryptedMessage.payload).not.to.be.equal(message);
        const decryptedMessage = recipientPrivate.decryptMessage(encryptedMessage, senderPublic);
        chai_1.expect(decryptedMessage.payload).to.be.equal(message);
    });
    it('should decrypt message from js library test', () => {
        const encryptedMessageString = '5F8D37E8116B6DC9171FFEB7617B0988BFD8ABE0E611C2C34CC127B637D8192AF396CF605EE7CB0E7618DF82AA48C68460afb8873d3d3954a1528f2c70b11890f5d078c1fe345bb4f84c24f87bdbe652';
        const recipientPrivate = Account_1.Account.createFromPrivateKey('2618090794e9c9682f2ac6504369a2f4fb9fe7ee7746f9560aca228d355b1cb9', model_1.NetworkType.MAIN_NET);
        const senderPublic = model_1.PublicAccount.createFromPublicKey('2D04DFC0418A1A2893AA56CB651AE2F3FBE3884F77E64476984E9A6BFB1B7B46', model_1.NetworkType.MAIN_NET);
        const encryptMessage = new EncryptedMessage_1.EncryptedMessage(encryptedMessageString);
        const plainMessage = recipientPrivate.decryptMessage(encryptMessage, senderPublic);
        chai_1.expect(plainMessage.payload).to.be.equal('ProximaX is awesome !');
    });
    it('should decrypt message encrypted in java sdk', () => {
        const encryptMessage = new EncryptedMessage_1.EncryptedMessage('2BD9DAF45E1248FBC3BE8A6413E44B03797763E54124053E4669BBC00553AA4ED2AC04CD7CCD5981C12CB14DCBC689CC9D467A0231F94A50212695E38DDD13A04E451032DD2677CBFC24637A2D17F8A9');
        const sender = model_1.PublicAccount.createFromPublicKey('A36DF1F0B64C7FF71499784317C8D63FB1DB8E1909519AB72051D2BE77A1EF45', model_1.NetworkType.TEST_NET);
        const recipient = Account_1.Account.createFromPrivateKey('6556da78c063e0547b7fd2e8a8b66ba09b8f28043235fea441414f0fc591f507', model_1.NetworkType.TEST_NET);
        const plainMessage = recipient.decryptMessage(encryptMessage, sender);
        chai_1.expect(plainMessage.payload).to.be.equal('java SDK secure message');
    });
    it('should create secure message and decrypt message with sender private key ', () => {
        const payload = 'test-message';
        const senderPrivateKey = '4F03FDC5BCF3AE004FBEBF23D321DFE600FBB1B6739A7DAC45C58834EAD48193';
        const senderPublicKey = '2B36D62950AEF0170B0CC7ADC9615D7D96F8F54FF7BD7E783C17DBDFD55623A2';
        const recipientPrivateKey = 'B226CAEBCCA25566B2961023A8259A00EC7FCAFB2BAA408B78BB6E2E292E07C0';
        const recipientPublicKey = '633FD217940F7FEB21FF6477DEBF6ADECDA2891561276AFC393D979E14470B39';
        const recipientPublicAccount = model_1.PublicAccount.createFromPublicKey(recipientPublicKey, model_1.NetworkType.MIJIN_TEST);
        const secureMessage = EncryptedMessage_1.EncryptedMessage.create(payload, recipientPublicAccount, senderPrivateKey);
        const decodedMessagePayload = EncryptedMessage_1.EncryptedMessage.decrypt(secureMessage, senderPrivateKey, recipientPublicAccount);
        chai_1.expect(decodedMessagePayload.payload).to.be.equal(payload);
    });
    it('should create secure message and decrypt message with receiver private key', () => {
        const payload = 'test-message';
        const senderPrivateKey = '4F03FDC5BCF3AE004FBEBF23D321DFE600FBB1B6739A7DAC45C58834EAD48193';
        const senderPublicKey = '2B36D62950AEF0170B0CC7ADC9615D7D96F8F54FF7BD7E783C17DBDFD55623A2';
        const senderPublicAccount = model_1.PublicAccount.createFromPublicKey(senderPublicKey, model_1.NetworkType.MIJIN_TEST);
        const recipientPrivateKey = 'B226CAEBCCA25566B2961023A8259A00EC7FCAFB2BAA408B78BB6E2E292E07C0';
        const recipientPublicKey = '633FD217940F7FEB21FF6477DEBF6ADECDA2891561276AFC393D979E14470B39';
        const secureMessage = EncryptedMessage_1.EncryptedMessage.create(payload, senderPublicAccount, recipientPrivateKey);
        const decodedMessagePayload = EncryptedMessage_1.EncryptedMessage.decrypt(secureMessage, recipientPrivateKey, senderPublicAccount);
        chai_1.expect(decodedMessagePayload.payload).to.be.equal(payload);
    });
    it('should decrypt payload uploaded from java sdk with sender private key', () => {
        const expectedPayload = '{"privacyType":1001,"version":"1.0","data":{"dataHash":"QmTotbJZvihGRL8i8Pg1PSKjhTbVkcRVev974X3rydv1L8","timestamp":1541725165332,"description":"string description","metadata":{"keystring":"valstring"},"name":"string name","contentType":"text/plain"}}';
        const payload = '6B05BB2B1FC4F8CF3B486231A2FD53CCB28C284E55E361D834E044C6DADF0E3FC589901A2D6F7BF85AB3957CCAFA26F0AF3284A49BCE33FD8A67B0D68124ADB0039AF9D78E2FE9655A10E30A3CDCCEC28E39E4F701CA5763046D5439C4AC660055AF3C05ACBCFA3D760D2E41FBF6C5918E3E39DD8596BD067E3CB35A95FA00FF5D2B0AFE3A4C34F713DC8D855FA6077CAE7D85DEC6654F3F370EAF5E877C6A9A5AB8B9ADAA7BA212A20B1E0E05F5C45D4F8D7EF01A62E3822F4C4ADBA7C513A30B8B7BFE56B8C78B27F8FE34E937123CC067F7D60A14E67E6D2A568B74CF30AF0BF24D685977383A00607395B9BCD9CA3E4507A59C5735C7B3B503E3F031CE5B0B41DAE904E072869A9435862847EA5E70C09471BCCA12E09BA9FA93108C71EDC82E0901281E2B03F9024F82551843FB';
        const privateKey = '97226FCCBD876D399BA2A70E640AD2C2C97AD5CE57A40EE9455C226D3C39AD49';
        const publicKey = 'D1869362F4FAA5F683AEF78FC0D6E04B976833000F3958862A09CC7B6DF347C2';
        const publicAccount = model_1.PublicAccount.createFromPublicKey(publicKey, model_1.NetworkType.MIJIN_TEST);
        const secureMessage = new EncryptedMessage_1.EncryptedMessage(payload);
        const decodedMessagePayload = EncryptedMessage_1.EncryptedMessage.decrypt(secureMessage, privateKey, publicAccount).payload;
        chai_1.expect(decodedMessagePayload).to.be.equal(expectedPayload);
    });
    it('should decrypt payload uploaded from java sdk with receiver private key', () => {
        const expectedPayload = '{"privacyType":1001,"version":"1.0","data":{"dataHash":"QmTotbJZvihGRL8i8Pg1PSKjhTbVkcRVev974X3rydv1L8","timestamp":1541725165332,"description":"string description","metadata":{"keystring":"valstring"},"name":"string name","contentType":"text/plain"}}';
        const payload = '6B05BB2B1FC4F8CF3B486231A2FD53CCB28C284E55E361D834E044C6DADF0E3FC589901A2D6F7BF85AB3957CCAFA26F0AF3284A49BCE33FD8A67B0D68124ADB0039AF9D78E2FE9655A10E30A3CDCCEC28E39E4F701CA5763046D5439C4AC660055AF3C05ACBCFA3D760D2E41FBF6C5918E3E39DD8596BD067E3CB35A95FA00FF5D2B0AFE3A4C34F713DC8D855FA6077CAE7D85DEC6654F3F370EAF5E877C6A9A5AB8B9ADAA7BA212A20B1E0E05F5C45D4F8D7EF01A62E3822F4C4ADBA7C513A30B8B7BFE56B8C78B27F8FE34E937123CC067F7D60A14E67E6D2A568B74CF30AF0BF24D685977383A00607395B9BCD9CA3E4507A59C5735C7B3B503E3F031CE5B0B41DAE904E072869A9435862847EA5E70C09471BCCA12E09BA9FA93108C71EDC82E0901281E2B03F9024F82551843FB';
        const privateKey = 'D19EDBF7C5F4665BBB168F8BFF3DC1CA85766080B10AABD60DDE5D6D7E893D5B';
        const publicKey = '632479641258F56F961473CD729F6357563D276CE7B68D5AD8F9F7FA071BB963';
        const publicAccount = model_1.PublicAccount.createFromPublicKey(publicKey, model_1.NetworkType.MIJIN_TEST);
        const secureMessage = new EncryptedMessage_1.EncryptedMessage(payload);
        const decodedMessagePayload = EncryptedMessage_1.EncryptedMessage.decrypt(secureMessage, privateKey, publicAccount).payload;
        chai_1.expect(decodedMessagePayload).to.be.equal(expectedPayload);
    });
    it('should encrypt and decrypt message using NIS1 schema', () => {
        const encryptedMessage = sender_nis.encryptMessage('Testing simple transfer', recipient_nis.publicAccount, crypto_1.SignSchema.KECCAK_REVERSED_KEY);
        const payload = encryptedMessage.payload;
        const plainMessage = recipient_nis.decryptMessage(new EncryptedMessage_1.EncryptedMessage(payload), sender_nis.publicAccount, crypto_1.SignSchema.KECCAK_REVERSED_KEY);
        chai_1.expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });
});
//# sourceMappingURL=EncryptedMessage.spec.js.map