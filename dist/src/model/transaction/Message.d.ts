/**
 * An abstract message class that serves as the base class of all message types.
 */
export declare class Message {
    readonly type: number;
    /**
     * Message payload
     */
    readonly payload: string;
    /**
     * @internal
     * @param hex
     * @returns {string}
     */
    static decodeHex(hex: string): string;
    /**
     * @internal
     * @param type
     * @param payload
     */
    constructor(/**
                 * Message type
                 */ type: number, 
    /**
     * Message payload
     */
    payload: string);
    /**
     * Create DTO object
     */
    toDTO(): {
        type: number;
        payload: string;
    };
}
