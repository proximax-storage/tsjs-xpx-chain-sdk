import { Observable } from 'rxjs';
import { BlockchainScore } from '../model/blockchain/BlockchainScore';
import { UInt64 } from '../model/UInt64';
import { ChainRepository } from './ChainRepository';
import { Http } from './Http';
<<<<<<< HEAD
/**
 * Chain http repository.
=======
import { Authentication } from './model/models';
/**
 * Chian http repository.
>>>>>>> jwt
 *
 * @since 1.0
 */
export declare class ChainHttp extends Http implements ChainRepository {
    /**
     * Constructor
     * @param url
     */
<<<<<<< HEAD
    constructor(url: string);
=======
    constructor(url: string, auth?: Authentication, headers?: {});
>>>>>>> jwt
    /**
     * Gets current blockchain height
     * @returns Observable<UInt64>
     */
    getBlockchainHeight(): Observable<UInt64>;
    /**
     * Gets current blockchain score
     * @returns Observable<BlockchainScore>
     */
    getBlockchainScore(): Observable<BlockchainScore>;
}
