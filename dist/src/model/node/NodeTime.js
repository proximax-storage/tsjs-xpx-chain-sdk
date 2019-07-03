"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The node info structure describes basic information of a node.
 */
class NodeTime {
    /**
     * @param sendTimeStamp
     * @param receiveTimeStamp
     */
    constructor(/**
                 * The request send timestamp
                 */ sendTimeStamp, 
    /**
     * The request received timestamp
     */
    receiveTimeStamp) {
        this.sendTimeStamp = sendTimeStamp;
        this.receiveTimeStamp = receiveTimeStamp;
    }
}
exports.NodeTime = NodeTime;
//# sourceMappingURL=NodeTime.js.map