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
     * @param message
     * @param recipientPublicAccount
     * @param privateKey
     */
    static create(message: string, recipientPublicAccount: PublicAccount, privateKey: any): EncryptedMessage;
    /**
     *
     * @param payload
     */
    static createFromDTO(payload: string): EncryptedMessage;
    /**
     *
     * @param encryptMessage
     * @param privateKey
     * @param recipientPublicAccount
     */
    static decrypt(encryptMessage: EncryptedMessage, privateKey: any, recipientPublicAccount: PublicAccount): PlainMessage;
}
