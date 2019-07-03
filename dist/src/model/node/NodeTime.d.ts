/**
 * The node info structure describes basic information of a node.
 */
export declare class NodeTime {
    readonly sendTimeStamp?: number[] | undefined;
    /**
     * The request received timestamp
     */
    readonly receiveTimeStamp?: number[] | undefined;
    /**
     * @param sendTimeStamp
     * @param receiveTimeStamp
     */
    constructor(/**
                 * The request send timestamp
                 */ sendTimeStamp?: number[] | undefined, 
    /**
     * The request received timestamp
     */
    receiveTimeStamp?: number[] | undefined);
}
