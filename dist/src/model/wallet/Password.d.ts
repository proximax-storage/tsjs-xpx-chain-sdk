/**
 * Password model
 */
export declare class Password {
    /**
     * Password value
     */
    readonly value: string;
    /**
     * Create a password with at least 8 characters
     * @param password
     */
    constructor(password: string);
}
