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

export enum DriveSortingField{

    ID = "id"
}

export class DriveFieldOrder{

    constructor(public orderBy: DriveSortingField | string, public order: Order_v2){
    }

    static setAscending(orderBy: DriveSortingField | string){
        return new DriveFieldOrder(orderBy, Order_v2.ASC);
    }

    static setDescending(orderBy: DriveSortingField | string){
        return new DriveFieldOrder(orderBy, Order_v2.DESC);
    }
}

export class DriveQueryParams extends PaginationQueryParams{

    /**
    * Size of drive (MB).
    */
    size?: number | UInt64 | bigint;
    /**
    * From size of drive (MB).
    */
    fromSize?: number | UInt64 | bigint;
    /**
    * To size of drive (MB).
    */
    toSize?: number | UInt64 | bigint;
    /**
    * Used size of drive.
    */
    usedSize?: number | UInt64 | bigint;
    /**
    * From used size of drive.
    */
    fromUsedSize?: number | UInt64 | bigint;
    /**
    * To used size of drive.
    */
    toUsedSize?: number | UInt64 | bigint;
    /**
     * Meta file size of drive.
    */
    metaFilesSize?: number | UInt64 | bigint;
    /**
     * From meta file size of drive.
    */
    fromMetaFilesSize?: number | UInt64 | bigint;
    /**
     * To meta file size of drive.
    */
    toMetaFilesSize?: number | UInt64 | bigint;
    /**
     * Number of replicators.
    */
    replicatorCount?: number;
    /**
     * From number of replicators.
    */
    fromReplicatorCount?: number;
    /**
     * To number of replicators.
    */
    toReplicatorCount?: number;
    /**
     * Public key of an Owner.
     */
    owner?: string | PublicAccount; 

    order?: Order_v2;
    orderBy?: string;
    offset?: string;

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    updateFieldOrder(DriveFieldOrder: DriveFieldOrder){
        this.orderBy = DriveFieldOrder.orderBy;
        this.order = DriveFieldOrder.order;
    }

    buildQueryParams(): object{
        let queryParams = Object.assign({}, this);

        DriveQueryParams.adjustNonComplianceParams(queryParams);
        DriveQueryParams.convertToPrimitiveType(queryParams);

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

    static convertToPrimitiveType(queryParams: DriveQueryParams){
        if(queryParams.size){
            if(queryParams.size instanceof UInt64){
                queryParams.size = queryParams.size.toBigInt();
            }
        }

        if(queryParams.fromSize){
            if(queryParams.fromSize instanceof UInt64){
                queryParams.fromSize = queryParams.fromSize.toBigInt();
            }
        }

        if(queryParams.toSize){
            if(queryParams.toSize instanceof UInt64){
                queryParams.toSize = queryParams.toSize.toBigInt();
            }
        }

        if(queryParams.usedSize){
            if(queryParams.usedSize instanceof UInt64){
                queryParams.usedSize = queryParams.usedSize.toBigInt();
            }
        }

        if(queryParams.fromUsedSize){
            if(queryParams.fromUsedSize instanceof UInt64){
                queryParams.fromUsedSize = queryParams.fromUsedSize.toBigInt();
            }
        }

        if(queryParams.toUsedSize){
            if(queryParams.toUsedSize instanceof UInt64){
                queryParams.toSize = queryParams.toUsedSize.toBigInt();
            }
        }

        if(queryParams.metaFilesSize){
            if(queryParams.metaFilesSize instanceof UInt64){
                queryParams.metaFilesSize = queryParams.metaFilesSize.toBigInt();
            }
        }

        if(queryParams.fromMetaFilesSize){
            if(queryParams.fromMetaFilesSize instanceof UInt64){
                queryParams.fromMetaFilesSize = queryParams.fromMetaFilesSize.toBigInt();
            }
        }

        if(queryParams.toMetaFilesSize){
            if(queryParams.toMetaFilesSize instanceof UInt64){
                queryParams.toMetaFilesSize = queryParams.toMetaFilesSize.toBigInt();
            }
        }

        if(queryParams.owner){
            if(queryParams.owner instanceof PublicAccount){
                queryParams.owner = queryParams.owner.publicKey;
            }
        }
    }

    static adjustNonComplianceParams(queryParams: DriveQueryParams){
        if(queryParams.size){
            if(queryParams.fromSize){
                delete queryParams.fromSize;
            }

            if(queryParams.toSize){
                delete queryParams.toSize;
            }
        }

        if(queryParams.usedSize){
            if(queryParams.fromUsedSize){
                delete queryParams.fromUsedSize;
            }

            if(queryParams.toUsedSize){
                delete queryParams.toUsedSize;
            }
        }

        if(queryParams.metaFilesSize){
            if(queryParams.fromMetaFilesSize){
                delete queryParams.fromMetaFilesSize;
            }

            if(queryParams.toMetaFilesSize){
                delete queryParams.toMetaFilesSize;
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
