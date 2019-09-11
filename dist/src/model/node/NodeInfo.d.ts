import { NetworkType } from '../blockchain/NetworkType';
import { RoleType } from './RoleType';
/**
 * The node info structure describes basic information of a node.
 */
export declare class NodeInfo {
    readonly publicKey: string;
    /**
     * The port used for the communication.
     */
    readonly port: number;
    /**
     * The network identifier.
     */
    readonly networkIdentifier: NetworkType;
    /**
     * The version of the application.
     */
    readonly version: number;
    /**
     * The roles of the application.
     */
    readonly roles: RoleType;
    /**
     * The IP address of the endpoint.
     */
    readonly host: string;
    /**
     * The name of the node.
     */
    readonly friendlyName: string;
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
                 */ publicKey: string, 
    /**
     * The port used for the communication.
     */
    port: number, 
    /**
     * The network identifier.
     */
    networkIdentifier: NetworkType, 
    /**
     * The version of the application.
     */
    version: number, 
    /**
     * The roles of the application.
     */
    roles: RoleType, 
    /**
     * The IP address of the endpoint.
     */
    host: string, 
    /**
     * The name of the node.
     */
    friendlyName: string);
}
