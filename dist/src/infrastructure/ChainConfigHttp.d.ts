import { Observable } from 'rxjs';
import { ChainConfigRepository } from './ChainConfigRepository';
import { Http } from './Http';
import { ChainConfig } from '../model/model';
/**
 * Chian http repository.
 *
 * @since 1.0
 */
export declare class ChainConfigHttp extends Http implements ChainConfigRepository {
    /**
     * Constructor
     * @param url
     */
    constructor(url: string);
    /**
     * Gets blockchain configuration at given height
     * @param height
     * @returns Observable<ChainConfig>
     */
    getChainConfig(height: number): Observable<ChainConfig>;
}
