import { Message } from './Message';
export declare class SecureMessage extends Message {
    static create(message: string, publicKey: string, privateKey: string): SecureMessage;
    /**
     *
     */
    static createFromDTO(payload: string): SecureMessage;
    decrypt(publicKey: string, privateKey: string): string;
}
