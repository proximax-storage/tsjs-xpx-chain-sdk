export declare class SyncAnnounce {
    /**
     * Transaction serialized data
     */
    readonly payload: string;
    /**
     * Transaction hash
     */
    readonly hash: string;
    /**
     * Transaction address
     */
    readonly address: string;
    /**
     * @internal
     * @param payload
     * @param hash
     * @param address
     */
    constructor(
    /**
     * Transaction serialized data
     */
    payload: string, 
    /**
     * Transaction hash
     */
    hash: string, 
    /**
     * Transaction address
     */
    address: string);
}
