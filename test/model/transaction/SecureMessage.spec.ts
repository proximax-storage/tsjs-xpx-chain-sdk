import {expect} from 'chai';
import {EncryptedMessage} from '../../../src/model/transaction/EncryptedMessage';
import { PublicAccount, NetworkType } from '../../../src/model/model';
import { convert } from 'proximax-nem2-library';

describe('SecureMessage', () => {
    it('should create secure message and decrypt message with sender private key ', () => {
        const payload = 'test-message';
        const senderPrivateKey = '4F03FDC5BCF3AE004FBEBF23D321DFE600FBB1B6739A7DAC45C58834EAD48193';
        const senderPublicKey = '2B36D62950AEF0170B0CC7ADC9615D7D96F8F54FF7BD7E783C17DBDFD55623A2';
        const recipientPrivateKey = 'B226CAEBCCA25566B2961023A8259A00EC7FCAFB2BAA408B78BB6E2E292E07C0';
        const recipientPublicKey = '633FD217940F7FEB21FF6477DEBF6ADECDA2891561276AFC393D979E14470B39';
        const recipientPublicAccount = PublicAccount.createFromPublicKey(recipientPublicKey, NetworkType.MIJIN_TEST);

        const secureMessage = EncryptedMessage.create(payload, recipientPublicAccount, senderPrivateKey);

        const decodedMessagePayload = EncryptedMessage.decrypt(secureMessage, senderPrivateKey, recipientPublicAccount);

        expect(decodedMessagePayload.payload).to.be.equal(payload);
    });

    it('should create secure message and decrypt message with receiver private key', () => {
        const payload = 'test-message';
        const senderPrivateKey = '4F03FDC5BCF3AE004FBEBF23D321DFE600FBB1B6739A7DAC45C58834EAD48193';
        const senderPublicKey = '2B36D62950AEF0170B0CC7ADC9615D7D96F8F54FF7BD7E783C17DBDFD55623A2';
        const senderPublicAccount = PublicAccount.createFromPublicKey(senderPublicKey, NetworkType.MIJIN_TEST);
        const recipientPrivateKey = 'B226CAEBCCA25566B2961023A8259A00EC7FCAFB2BAA408B78BB6E2E292E07C0';
        const recipientPublicKey = '633FD217940F7FEB21FF6477DEBF6ADECDA2891561276AFC393D979E14470B39';

        const secureMessage = EncryptedMessage.create(payload, senderPublicAccount, recipientPrivateKey);

        const decodedMessagePayload = EncryptedMessage.decrypt(secureMessage, recipientPrivateKey, senderPublicAccount);

        expect(decodedMessagePayload.payload).to.be.equal(payload);
    });

    it('should decrypt payload uploaded from java sdk with sender private key', () => {
        const expectedPayload = '{"privacyType":1001,"version":"1.0","data":{"dataHash":"QmTotbJZvihGRL8i8Pg1PSKjhTbVkcRVev974X3rydv1L8","timestamp":1541725165332,"description":"string description","metadata":{"keystring":"valstring"},"name":"string name","contentType":"text/plain"}}';
        const payload = '6B05BB2B1FC4F8CF3B486231A2FD53CCB28C284E55E361D834E044C6DADF0E3FC589901A2D6F7BF85AB3957CCAFA26F0AF3284A49BCE33FD8A67B0D68124ADB0039AF9D78E2FE9655A10E30A3CDCCEC28E39E4F701CA5763046D5439C4AC660055AF3C05ACBCFA3D760D2E41FBF6C5918E3E39DD8596BD067E3CB35A95FA00FF5D2B0AFE3A4C34F713DC8D855FA6077CAE7D85DEC6654F3F370EAF5E877C6A9A5AB8B9ADAA7BA212A20B1E0E05F5C45D4F8D7EF01A62E3822F4C4ADBA7C513A30B8B7BFE56B8C78B27F8FE34E937123CC067F7D60A14E67E6D2A568B74CF30AF0BF24D685977383A00607395B9BCD9CA3E4507A59C5735C7B3B503E3F031CE5B0B41DAE904E072869A9435862847EA5E70C09471BCCA12E09BA9FA93108C71EDC82E0901281E2B03F9024F82551843FB';
        const privateKey = '97226FCCBD876D399BA2A70E640AD2C2C97AD5CE57A40EE9455C226D3C39AD49';
        const publicKey = 'D1869362F4FAA5F683AEF78FC0D6E04B976833000F3958862A09CC7B6DF347C2';
        const publicAccount = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        const secureMessage = new EncryptedMessage(payload);

        const decodedMessagePayload = EncryptedMessage.decrypt(secureMessage, privateKey, publicAccount);

        expect(decodedMessagePayload).to.be.equal(expectedPayload);
    });

    it('should decrypt payload uploaded from java sdk with receiver private key', () => {
        const expectedPayload = '{"privacyType":1001,"version":"1.0","data":{"dataHash":"QmTotbJZvihGRL8i8Pg1PSKjhTbVkcRVev974X3rydv1L8","timestamp":1541725165332,"description":"string description","metadata":{"keystring":"valstring"},"name":"string name","contentType":"text/plain"}}';
        const payload = '6B05BB2B1FC4F8CF3B486231A2FD53CCB28C284E55E361D834E044C6DADF0E3FC589901A2D6F7BF85AB3957CCAFA26F0AF3284A49BCE33FD8A67B0D68124ADB0039AF9D78E2FE9655A10E30A3CDCCEC28E39E4F701CA5763046D5439C4AC660055AF3C05ACBCFA3D760D2E41FBF6C5918E3E39DD8596BD067E3CB35A95FA00FF5D2B0AFE3A4C34F713DC8D855FA6077CAE7D85DEC6654F3F370EAF5E877C6A9A5AB8B9ADAA7BA212A20B1E0E05F5C45D4F8D7EF01A62E3822F4C4ADBA7C513A30B8B7BFE56B8C78B27F8FE34E937123CC067F7D60A14E67E6D2A568B74CF30AF0BF24D685977383A00607395B9BCD9CA3E4507A59C5735C7B3B503E3F031CE5B0B41DAE904E072869A9435862847EA5E70C09471BCCA12E09BA9FA93108C71EDC82E0901281E2B03F9024F82551843FB';
        const privateKey = 'D19EDBF7C5F4665BBB168F8BFF3DC1CA85766080B10AABD60DDE5D6D7E893D5B';
        const publicKey = '632479641258F56F961473CD729F6357563D276CE7B68D5AD8F9F7FA071BB963';
        const publicAccount = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        const secureMessage = new EncryptedMessage(payload);

        const decodedMessagePayload = EncryptedMessage.decrypt(secureMessage, privateKey, publicAccount);

        expect(decodedMessagePayload).to.be.equal(expectedPayload);
    });

});
