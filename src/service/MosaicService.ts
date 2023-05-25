/*
 * Copyright 2023 ProximaX
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable, of as observableOf } from 'rxjs';
import { filter, first, map, mergeMap, take, toArray } from 'rxjs/operators';
import { AccountHttp } from '../infrastructure/AccountHttp';
import { MosaicHttp } from '../infrastructure/MosaicHttp';
import { ChainHttp } from '../infrastructure/ChainHttp';
import { Address } from '../model/account/Address';
import { MosaicInfo, AccountInfo } from '../model/model';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { UInt64 } from '../model/UInt64';
import { MosaicAmountView } from './MosaicAmountView';
import { MosaicView } from './MosaicView';

/**
 * Mosaic service
 */
export class MosaicService {

    /**
     * Constructor
     * @param accountHttp
     * @param mosaicHttp
     */
    constructor(private readonly accountHttp: AccountHttp,
                private readonly mosaicHttp: MosaicHttp,
                private readonly chainHttp: ChainHttp) {

    }

    /**
     * Get mosaic view given mosaicIds
     * @param mosaicIds - The ids of the mosaics
     * @returns {Observable<MosaicView[]>}
     */
    mosaicsView(mosaicIds: MosaicId[]): Observable<MosaicView[]> {
        return observableOf(mosaicIds).pipe(
            mergeMap((_: MosaicId[]) => this.mosaicHttp.getMosaics(mosaicIds).pipe(
                mergeMap((_: MosaicInfo[]) => _),
                map((mosaicInfo: MosaicInfo) => {
                    return new MosaicView(mosaicInfo);
                }),
                toArray())));
    }

    /**
     * Get mosaic amount view given mosaic array
     * @param mosaics
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountView(mosaics: Mosaic[]): Observable<MosaicAmountView[]> {
        return observableOf(mosaics).pipe(
            mergeMap((_: Mosaic[]) => _),
            mergeMap((mosaic: Mosaic) => 
                this.mosaicsView([mosaic.id]).pipe(
                    filter((_: MosaicView[]) => _.length !== 0),
                    map<MosaicView[], MosaicAmountView>((mosaicViews) => {
                        return new MosaicAmountView(mosaicViews[0].mosaicInfo, mosaic.amount);
                    }),
                toArray())
            ));
    }

    /**
     * Get balance mosaics in form of MosaicAmountViews for a given account address
     * @param address - Account address
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountViewFromAddress(address: Address): Observable<MosaicAmountView[]> {
        return observableOf(address).pipe(
            mergeMap((_: Address) => this.accountHttp.getAccountInfo(_)),
            mergeMap((_: AccountInfo) => this.mosaicsAmountView(_.mosaics)));
    }

    /**
     * Get mosaic remaining blocks for a given mosaicId
     * @param mosaicId - MosaicId
     * @returns {Observable<number>}
     */
    mosaicRemainingBlock(mosaicId: MosaicId): Observable<number> {
        return observableOf(mosaicId).pipe(
            mergeMap((_: MosaicId) => this.mosaicHttp.getMosaic(_)),
            mergeMap((_: MosaicInfo) => _.duration && _.duration.compact() !== 0 ?
                this.chainHttp.getBlockchainHeight()
                    .pipe(
                        map((chainHeight: UInt64) => (_.duration!.compact() + _.height.compact() ) - chainHeight.compact() ),
                    ) : observableOf(Number.POSITIVE_INFINITY),
            ),
        )
    }
}
