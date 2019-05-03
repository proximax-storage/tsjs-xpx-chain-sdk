/**
 * An abstract message class that serves as the base class of all message types.
 */
export declare abstract class Message {
    readonly type: number;
    /**
     * Message encoded payload in hex
     */
    readonly hexEncodedPayload: string;
    /**
     * Message raw payload
     */
    readonly payload?: string | undefined;
    /**
     * Create DTO object
     */
    toDTO(): {
        type: number;
        payload: string | undefined;
    };
}
