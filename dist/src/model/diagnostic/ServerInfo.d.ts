/**
 * The server information.
 */
export declare class ServerInfo {
    readonly restVersion: string;
    /**
     * the catapult-sdk component version
     */
    readonly sdkVersion: string;
    /**
     * @param restVersion - The catapult-rest component version
     * @param sdkVersion - the catapult-sdk component version
     */
    constructor(/**
                 * The catapult-rest component version
                 */ restVersion: string, 
    /**
     * the catapult-sdk component version
     */
    sdkVersion: string);
}
