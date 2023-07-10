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

import { Order_v2 } from "./QueryParams";
import { UInt64 } from "../model/model";
import { PaginationQueryParams } from "./PaginationQueryParams";

export enum ReplicatorSortingField{

    ID = "id"
}

export class ReplicatorFieldOrder{

    constructor(public orderBy: ReplicatorSortingField | string, public order: Order_v2){
    }

    static setAscending(orderBy: ReplicatorSortingField | string){
        return new ReplicatorFieldOrder(orderBy, Order_v2.ASC);
    }

    static setDescending(orderBy: ReplicatorSortingField | string){
        return new ReplicatorFieldOrder(orderBy, Order_v2.DESC);
    }
}

export class ReplicatorQueryParams extends PaginationQueryParams{

    /**
    * Version of replicator.
    */
    version?: number;
    /**
    * From version of replicator.
    */
    fromVersion?: number;
    /**
    * To version of replicator.
    */
    toVersion?: number;
    /**
    * Storage size that the replicator provides.
    */
    capacity?: number | UInt64 | bigint;
    /**
    * From storage size that the replicator provides.
    */
    fromCapacity?: number | UInt64 | bigint;
    /**
    * To storage size that the replicator provides.
    */
    toCapacity?: number | UInt64 | bigint;
    offset?: string;
    orderBy?: string;
    order?: Order_v2;

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    updateFieldOrder(replicatorFieldOrder: ReplicatorFieldOrder){
        this.orderBy = replicatorFieldOrder.orderBy;
        this.order = replicatorFieldOrder.order;
    }

    buildQueryParams(): object{
        let queryParams = Object.assign({}, this);

        ReplicatorQueryParams.adjustNonComplianceParams(queryParams);
        ReplicatorQueryParams.convertToPrimitiveType(queryParams);

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

    static convertToPrimitiveType(queryParams: ReplicatorQueryParams){
        if(queryParams.capacity){
            if(queryParams.capacity instanceof UInt64){
                queryParams.capacity = queryParams.capacity.toBigInt();
            }
        }

        if(queryParams.toCapacity){
            if(queryParams.toCapacity instanceof UInt64){
                queryParams.toCapacity = queryParams.toCapacity.toBigInt();
            }
        }

        if(queryParams.fromCapacity){
            if(queryParams.fromCapacity instanceof UInt64){
                queryParams.fromCapacity = queryParams.fromCapacity.toBigInt();
            }
        }
    }

    static adjustNonComplianceParams(queryParams: ReplicatorQueryParams){
        if(queryParams.capacity){
            if(queryParams.toCapacity){
                delete queryParams.toCapacity;
            }

            if(queryParams.fromCapacity){
                delete queryParams.fromCapacity;
            }
        }

        if(queryParams.version){
            if(queryParams.toVersion){
                delete queryParams.toVersion;
            }

            if(queryParams.fromVersion){
                delete queryParams.fromVersion;
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
