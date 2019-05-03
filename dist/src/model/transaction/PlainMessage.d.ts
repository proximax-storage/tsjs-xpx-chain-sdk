import { Message } from './Message';
/**
 * The plain message model defines a plain string. When sending it to the network we transform the payload to hex-string.
 */
export declare class PlainMessage extends Message {
    /**
     * Create plain message object.
     * @returns PlainMessage
     */
    static create(message: string): PlainMessage;
}
/**
 * Plain message containing an empty string
 * @type {PlainMessage}
 */
export declare const EmptyMessage: PlainMessage;
