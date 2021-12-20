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
import { Address } from "../model/account/Address";
import { TransactionType } from "../model/transaction/TransactionType"
import { Order_v2 } from "./QueryParams";

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

    constructor(public order: Order_v2, public sortingField: TransactionSortingField){
    }

    static setAscending(sortingField: TransactionSortingField){
        return new TransactionFieldOrder(Order_v2.ASC, sortingField);
    }

    static setDescending(sortingField: TransactionSortingField){
        return new TransactionFieldOrder(Order_v2.DESC, sortingField);
    }
}

export class TransactionQueryParams{

    pageSize?: number;
    pageNumber?: number;
    type?: TransactionType[] | number[];
    embedded?: boolean;
    order?: Order_v2;
    sortField?: TransactionSortingField;
    toHeight?: number;
    fromHeight?: number;
    height?: number;
    signerPublicKey?: string | PublicAccount;
    recipientAddress?: string | Address;
    address?: string | Address;
    account?: string | PublicAccount;
    
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

        TransactionQueryParams.adjustNonComplianceParams(queryParams);
        TransactionQueryParams.convertToPrimitiveType(queryParams);

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

    static convertToPrimitiveType(queryParams: TransactionQueryParams){
        if(queryParams.recipientAddress){
            if(queryParams.recipientAddress instanceof Address){
                queryParams.recipientAddress = queryParams.recipientAddress.plain();
            }
        }

        if(queryParams.signerPublicKey){
            if(queryParams.signerPublicKey instanceof PublicAccount){
                queryParams.signerPublicKey = queryParams.signerPublicKey.publicKey;
            }
        }

        if(queryParams.account){
            if(queryParams.account instanceof PublicAccount){
                queryParams.account = queryParams.account.publicKey;
            }
        }

        if(queryParams.address){
            if(queryParams.address instanceof Address){
                queryParams.address = queryParams.address.plain();
            }
        }
    }

    static adjustNonComplianceParams(queryParams: TransactionQueryParams){
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

        if(queryParams.order === undefined || queryParams.sortField === undefined){
            if(queryParams.order){
                delete queryParams.order;
            }
            if(queryParams.sortField){
                delete queryParams.sortField;
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

        if(queryParams.account){
            if(queryParams.address){
                delete queryParams.address;
            }

            if(queryParams.signerPublicKey){
                delete queryParams.signerPublicKey;
            }

            if(queryParams.recipientAddress){
                delete queryParams.recipientAddress;
            }
        }
        else if(queryParams.address){
            if(queryParams.signerPublicKey){
                delete queryParams.signerPublicKey;
            }

            if(queryParams.recipientAddress){
                delete queryParams.recipientAddress;
            }
        }
    }
}
