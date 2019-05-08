import { PublicAccount } from '../account/PublicAccount';
import { Message } from './Message';
import { PlainMessage } from './PlainMessage';
/**
 * Encrypted Message model
 */
export declare class EncryptedMessage extends Message {
    readonly recipientPublicAccount?: PublicAccount;
    constructor(payload: string, recipientPublicAccount?: PublicAccount);
    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     */
    static create(message: string, recipientPublicAccount: PublicAccount, privateKey: any): EncryptedMessage;
    /**
     *
     * @param payload
     */
    static createFromPayload(payload: string): EncryptedMessage;
    /**
     *
     * @param encryptMessage - Encrypted message to be decrypted
     * @param privateKey - Recipient private key
     * @param recipientPublicAccount - Sender public account
     */
    static decrypt(encryptMessage: EncryptedMessage, privateKey: any, recipientPublicAccount: PublicAccount): PlainMessage;
}
