/**
 * An abstract message class that serves as the base class of all message types.
 */
export declare abstract class Message {
    readonly type: number;
    /**
     * Message payload
     */
    readonly payload: string;
    /**
     * Create DTO object
     */
    toDTO(): {
        type: number;
        payload: string;
    };
}
