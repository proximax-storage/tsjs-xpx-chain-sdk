import { Observable } from 'rxjs';
import { ChainUpgradeRepository } from './ChainUpgradeRepository';
import { Http } from './Http';
import { ChainUpgrade } from '../model/model';
/**
 * Chian http repository.
 *
 * @since 1.0
 */
export declare class ChainUpgradeHttp extends Http implements ChainUpgradeRepository {
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
    getChainUpgrade(height: number): Observable<ChainUpgrade>;
}
