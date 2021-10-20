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

import { Order } from "./QueryParams";

/*
export class TransactionSearchMosaic{

    transferMosaicId: string;
    toTransferAmount?: number;
    fromTransferAmount?: number;

    constructor(transferMosaicId: string){
        this.transferMosaicId = transferMosaicId;
    }

    toQueryParams(){
        return Object.keys(this);
    }
}
*/

export enum TransactionSortingField{

    BLOCK = "meta.height"
}

export class TransactionFieldOrder{

    constructor(public order: Order, public sortingField: TransactionSortingField){
    }

    static setAscending(sortingField: TransactionSortingField){
        return new TransactionFieldOrder(Order.ASC, sortingField);
    }

    static setDescending(sortingField: TransactionSortingField){
        return new TransactionFieldOrder(Order.DESC, sortingField);
    }
}

export class TransactionQueryParams{

    pageSize?: number;
    pageNumber?: number;
    type?: number[];
    embedded?: boolean;
    order?: Order;
    sortField?: TransactionSortingField;
    toHeight?: number;
    fromHeight?: number;
    height?: number;
    signerPublicKey?: string;
    recipientAddress?: string;
    address?: string;
    
    /* non-applicable for now
    transferMosaicId?: TransactionSearchMosaic;
    offset?: string;
    */

    /**
     * Constructor
     */
    constructor() {

    }

    updateFieldOrder(transactionFieldOrder: TransactionFieldOrder){
        this.sortField = transactionFieldOrder.sortingField;
        this.order = transactionFieldOrder.order;
    }

    buildQueryParams(): object{
        let queryParams = Object.assign({}, this);

        if(queryParams.height){
            if(queryParams.toHeight){
                delete queryParams.toHeight;
            }

            if(queryParams.fromHeight){
                delete queryParams.fromHeight;
            }
        }

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

        if(queryParams.address){
            if(queryParams.signerPublicKey){
                delete queryParams.signerPublicKey;
            }

            if(queryParams.recipientAddress){
                delete queryParams.recipientAddress;
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

        return queryParams;
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
}
