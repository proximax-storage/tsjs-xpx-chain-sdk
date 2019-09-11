import { Observable } from 'rxjs';
import { AccountHttp } from '../infrastructure/AccountHttp';
import { MosaicHttp } from '../infrastructure/MosaicHttp';
import { Address } from '../model/account/Address';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicAmountView } from './MosaicAmountView';
import { MosaicView } from './MosaicView';
/**
 * Mosaic service
 */
export declare class MosaicService {
    private readonly accountHttp;
    private readonly mosaicHttp;
    /**
     * Constructor
     * @param accountHttp
     * @param mosaicHttp
     */
    constructor(accountHttp: AccountHttp, mosaicHttp: MosaicHttp);
    /**
     * Get mosaic view given mosaicIds
     * @param mosaicIds - The ids of the mosaics
     * @returns {Observable<MosaicView[]>}
     */
    mosaicsView(mosaicIds: MosaicId[]): Observable<MosaicView[]>;
    /**
     * Get mosaic amount view given mosaic array
     * @param mosaics
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountView(mosaics: Mosaic[]): Observable<MosaicAmountView[]>;
    /**
     * Get balance mosaics in form of MosaicAmountViews for a given account address
     * @param address - Account address
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountViewFromAddress(address: Address): Observable<MosaicAmountView[]>;
}
