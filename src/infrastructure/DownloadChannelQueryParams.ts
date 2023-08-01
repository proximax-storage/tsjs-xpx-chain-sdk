/*
 * Copyright 2023 ProximaX
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
import { Address } from "../model/account/Address";
import { Order_v2 } from "./QueryParams";
import { UInt64 } from "../model/model";
import { MosaicId, NamespaceId } from "../model/model";
import { PaginationQueryParams } from "./PaginationQueryParams";

export enum DownloadChannelSortingField{

    ID = "id"
}

export class DownloadChannelFieldOrder{

    constructor(public orderBy: DownloadChannelSortingField | string, public order: Order_v2){
    }

    static setAscending(orderBy: DownloadChannelSortingField | string){
        return new DownloadChannelFieldOrder(orderBy, Order_v2.ASC);
    }

    static setDescending(orderBy: DownloadChannelSortingField | string){
        return new DownloadChannelFieldOrder(orderBy, Order_v2.DESC);
    }
}

export class DownloadChannelQueryParams extends PaginationQueryParams{

    /**
    * Download size in MB.
    */
    downloadSize?: number | UInt64 | bigint;;
    /**
    * From download size in MB.
    */
    fromDownloadSize?: number | UInt64 | bigint;;
    /**
    * To download size in MB.
    */
    toDownloadSize?: number | UInt64 | bigint;;
    /**
    * Number of completed download approval transactions.
    */
    downloadApprovalCount?: number;
    /**
    * From number of completed download approval transactions.
    */
    fromDownloadApprovalCount?: number;
    /**
    * To number of completed download approval transactions.
    */
    toDownloadApprovalCount?: number;
    consumerKey?: string;
    order?: Order_v2;
    orderBy?: string;
    offset?: string;

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    updateFieldOrder(DownloadChannelFieldOrder: DownloadChannelFieldOrder){
        this.orderBy = DownloadChannelFieldOrder.orderBy;
        this.order = DownloadChannelFieldOrder.order;
    }

    buildQueryParams(): object{
        let queryParams = Object.assign({}, this);

        DownloadChannelQueryParams.adjustNonComplianceParams(queryParams);
        DownloadChannelQueryParams.convertToPrimitiveType(queryParams);

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

    static convertToPrimitiveType(queryParams: DownloadChannelQueryParams){
        if(queryParams.downloadSize){
            if(queryParams.downloadSize instanceof UInt64){
                queryParams.downloadSize = queryParams.downloadSize.toBigInt();
            }
        }

        if(queryParams.fromDownloadSize){
            if(queryParams.fromDownloadSize instanceof UInt64){
                queryParams.fromDownloadSize = queryParams.fromDownloadSize.toBigInt();
            }
        }

        if(queryParams.toDownloadSize){
            if(queryParams.toDownloadSize instanceof UInt64){
                queryParams.toDownloadSize = queryParams.toDownloadSize.toBigInt();
            }
        }
    }

    static adjustNonComplianceParams(queryParams: DownloadChannelQueryParams){
        if(queryParams.downloadApprovalCount){
            if(queryParams.toDownloadApprovalCount){
                delete queryParams.toDownloadApprovalCount;
            }

            if(queryParams.fromDownloadApprovalCount){
                delete queryParams.fromDownloadApprovalCount;
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
    }
}
