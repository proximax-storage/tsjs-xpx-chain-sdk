import { Observable } from 'rxjs';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicInfo } from '../model/mosaic/MosaicInfo';
import { MosaicNames } from '../model/mosaic/MosaicNames';
import { Http } from './Http';
import { MosaicRepository } from './MosaicRepository';
import { NetworkHttp } from './NetworkHttp';
/**
 * Mosaic http repository.
 *
 * @since 1.0
 */
export declare class MosaicHttp extends Http implements MosaicRepository {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp);
    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    getMosaic(mosaicId: MosaicId): Observable<MosaicInfo>;
    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */
    getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]>;
    /**
     * Get readable names for a set of mosaics
     * Returns friendly names for mosaics.
     * @param mosaicIds - Array of mosaic ids
     * @return Observable<MosaicNames[]>
     */
    getMosaicsNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]>;
}
