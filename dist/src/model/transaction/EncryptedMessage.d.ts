import { SignSchema } from '../../core/crypto';
import { PublicAccount } from '../account/PublicAccount';
import { Message } from './Message';
import { PlainMessage } from './PlainMessage';
/**
 * Encrypted Message model
 */
export declare class EncryptedMessage extends Message {
    constructor(payload: string);
    size(): number;
    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {EncryptedMessage}
     */
    static create(message: string, recipientPublicAccount: PublicAccount, privateKey: any, signSchema?: SignSchema): EncryptedMessage;
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
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {PlainMessage}
     */
    static decrypt(encryptMessage: EncryptedMessage, privateKey: any, recipientPublicAccount: PublicAccount, signSchema?: SignSchema): PlainMessage;
}
