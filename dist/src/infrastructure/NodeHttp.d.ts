import { Observable } from 'rxjs';
import { NodeInfo } from '../model/node/NodeInfo';
import { NodeTime } from '../model/node/NodeTime';
import { Http } from './Http';
import { NodeRepository } from './NodeRepository';
/**
 * Node http repository.
 *
 * @since 1.0
 */
export declare class NodeHttp extends Http implements NodeRepository {
    /**
     * Constructor
     * @param url
     */
    constructor(url: string);
    /**
     * Supplies additional information about the application running on a node.
     * @summary Get the node information
     */
    getNodeInfo(): Observable<NodeInfo>;
    /**
     * Gets the node time at the moment the reply was sent and received.
     * @summary Get the node time
     */
    getNodeTime(): Observable<NodeTime>;
}
