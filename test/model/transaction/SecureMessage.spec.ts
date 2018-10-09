import { expect } from 'chai';
import { SecureMessage } from '../../../src/model/transaction/SecureMessage';

describe('SecureMessage', () => {
    it('should create secure message and decrypt message ', () => {
        const payload = 'test-message';
        const senderPrivateKey = '4F03FDC5BCF3AE004FBEBF23D321DFE600FBB1B6739A7DAC45C58834EAD48193';
        const senderPublicKey = '2B36D62950AEF0170B0CC7ADC9615D7D96F8F54FF7BD7E783C17DBDFD55623A2';
        const recipientPrivateKey = 'B226CAEBCCA25566B2961023A8259A00EC7FCAFB2BAA408B78BB6E2E292E07C0';
        const recipientPublicKey = '633FD217940F7FEB21FF6477DEBF6ADECDA2891561276AFC393D979E14470B39';

        const encryptedMessage = SecureMessage.create(payload, recipientPublicKey, senderPrivateKey);
        // console.log(encryptedMessage);

        const plainMessage = SecureMessage.decrypt(encryptedMessage.payload, recipientPublicKey, recipientPrivateKey);
        // console.log(plainMessage.payload);

        expect(plainMessage.payload).to.be.equal(payload);
    });
});