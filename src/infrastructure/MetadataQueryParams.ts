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
import { Address } from "../model/account/Address"
import { MetadataType } from "../model/metadata/MetadataType"
import { NamespaceId } from "../model/namespace/NamespaceId"
import { MosaicId } from "../model/mosaic/MosaicId"
import { PublicAccount } from "../model/account/PublicAccount"
import { UInt64 } from "../model/UInt64";

export enum MetadataSortingField{

    VALUE = "metadataEntry.value",
    VALUE_SIZE = "metadataEntry.valueSize"
}

export class MetadataFieldOrder{

    constructor(public order: Order, public sortingField: MetadataSortingField){
    }

    static setAscending(sortingField: MetadataSortingField){
        return new MetadataFieldOrder(Order.ASC, sortingField);
    }

    static setDescending(sortingField: MetadataSortingField){
        return new MetadataFieldOrder(Order.DESC, sortingField);
    }
}

export class MetadataQueryParams{

    pageSize?: number;
    pageNumber?: number;
    metadataType?: MetadataType;
    order?: Order;
    sortField?: MetadataSortingField;
    sourceAddress?: Address | string;
    targetId?: NamespaceId | MosaicId | string; // mosaic/ namespace hex string
    targetKey?: PublicAccount | string; // public key
    scopedMetadataKey?: UInt64 | string; // hex string

    /**
     * Constructor
     */
    constructor() {

    }

    updateFieldOrder(fieldOrder: MetadataFieldOrder){
        this.sortField = fieldOrder.sortingField;
        this.order = fieldOrder.order;
    }

    buildQueryParams(): object{
        let queryParams = Object.assign({}, this);

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

        if(queryParams.sourceAddress){
            if(queryParams.sourceAddress instanceof Address){
                queryParams.sourceAddress = queryParams.sourceAddress.plain();
            }
        }

        if(queryParams.targetId){
            if(queryParams.targetId instanceof NamespaceId){
                queryParams.targetId = queryParams.targetId.toHex();
            }
            else if(queryParams.targetId instanceof MosaicId){
                queryParams.targetId = queryParams.targetId.toHex();
            }
        }

        if(queryParams.targetKey){
            if(queryParams.targetKey instanceof PublicAccount){
                queryParams.targetKey = queryParams.targetKey.publicKey;
            }
        }

        if(queryParams.scopedMetadataKey){
            if(queryParams.scopedMetadataKey instanceof UInt64){
                queryParams.scopedMetadataKey = queryParams.scopedMetadataKey.toHex();
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
