/*
 * Copyright 2021 ProximaX
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

import { PublicAccount } from "../model/account/PublicAccount";
import { Order_v2 } from "./QueryParams";
import { PaginationQueryParams } from "./PaginationQueryParams";

export enum MosaicSortingField{

    BLOCK_HEIGHT = "mosaic.height",
    SUPPLY = "mosaic.supply"
}

export class MosaicFieldOrder{

    constructor(public sortingField: MosaicSortingField | string, public order: Order_v2){
    }

    static setAscending(sortingField: MosaicSortingField | string){
        return new MosaicFieldOrder(sortingField, Order_v2.ASC);
    }

    static setDescending(sortingField: MosaicSortingField | string){
        return new MosaicFieldOrder(sortingField, Order_v2.DESC);
    }
}

export class MosaicCreatorFilters{

    ownerPubKey: string | PublicAccount;
    /** 
     * optional when ownerPubKey defined 
     * true = returns only mosaics creator holding 
     * false = returns only mosaics creator not holding
    */
    holding?: boolean;

    constructor(ownerPublicKey: string | PublicAccount, holding?: boolean){
        this.ownerPubKey = ownerPublicKey;

        if(holding !== undefined){
            this.holding = holding;
        }
    }

    buildQueryParamsString(){
        let queryParams = this.buildQueryParams();
        const entries = Object.entries(queryParams);

        let queryParamsArray = entries.map(data=>{
            return data[0] + "=" + data[1]
        })

        return queryParamsArray.join("&")
    }

    buildQueryParams(){
        let queryParams = Object.assign({}, this);
        MosaicCreatorFilters.convertToPrimitiveType(queryParams);

        return queryParams;
    }

    static convertToPrimitiveType(queryParams: MosaicCreatorFilters){
        if(queryParams.ownerPubKey){
            if(queryParams.ownerPubKey instanceof PublicAccount){
                queryParams.ownerPubKey = queryParams.ownerPubKey.publicKey;
            }
        }
    }
}

export class MosaicQueryParams extends PaginationQueryParams{

    order?: Order_v2;
    sortField?: string | MosaicSortingField;
    ownerFilters?: MosaicCreatorFilters;
    mutable?: boolean;
    transferable?: boolean;
    supply?: number;

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    updateFieldOrder(fieldOrder: MosaicFieldOrder){
        this.sortField = fieldOrder.sortingField;
        this.order = fieldOrder.order;
    }

    buildQueryParams(): object{
        let queryParams = Object.assign({}, this);
        MosaicQueryParams.adjustNonComplianceParams(queryParams);
        
        let flattenedQueryParams = super.buildQueryParams(queryParams);

        return flattenedQueryParams;
    }

    buildQueryParamsString(): string{
        let queryParams = this.buildQueryParams();

        const entries = Object.entries(queryParams);

        let queryParamsArray = entries.map(data=>{

            if(data[1] instanceof Array){
                return data[1].map(arrayData=>{
                    return data[0] + "[]" + "=" + arrayData
                }).join("&");
            }
            return data[0] + "=" + data[1]
        })

        return queryParamsArray.join("&")
    }

    static adjustNonComplianceParams(queryParams: MosaicQueryParams){
        if(queryParams.pageSize){
            if(queryParams.pageSize < 0){
                delete queryParams.pageSize; // default to 20
            } else if(queryParams.pageSize < 10){
                queryParams.pageSize = 10;
            } else if(queryParams.pageSize > 100){
                queryParams.pageSize = 100;
            }
        }

        if(queryParams.pageNumber){
            if(queryParams.pageNumber <= 0){
                queryParams.pageNumber = 1;
            }
        }

        if(queryParams.order === undefined || queryParams.sortField === undefined){
            if(queryParams.order){
                delete queryParams.order;
            }
            if(queryParams.sortField){
                delete queryParams.sortField;
            }
        }
    }
}
