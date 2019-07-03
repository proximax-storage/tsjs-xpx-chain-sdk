"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The node info structure describes basic information of a node.
 */
class NodeInfo {
    /**
     * @param publicKey
     * @param port
     * @param networkIdentifier
     * @param version
     * @param roles
     * @param host
     * @param friendlyName
     */
    constructor(/**
                 * The public key used to identify the node.
                 */ publicKey, 
    /**
     * The port used for the communication.
     */
    port, 
    /**
     * The network identifier.
     */
    networkIdentifier, 
    /**
     * The version of the application.
     */
    version, 
    /**
     * The roles of the application.
     */
    roles, 
    /**
     * The IP address of the endpoint.
     */
    host, 
    /**
     * The name of the node.
     */
    friendlyName) {
        this.publicKey = publicKey;
        this.port = port;
        this.networkIdentifier = networkIdentifier;
        this.version = version;
        this.roles = roles;
        this.host = host;
        this.friendlyName = friendlyName;
    }
}
exports.NodeInfo = NodeInfo;
//# sourceMappingURL=NodeInfo.js.map