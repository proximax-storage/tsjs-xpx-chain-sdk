/*
 * Copyright 2022 ProximaX
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

export class PaginationQueryParams{

    pageSize?: number;
    pageNumber?: number;

    /**
     * Constructor
     */
    constructor() {

    }

    buildQueryParams(input?: object): object{
        let queryParams = input ? Object.assign({}, input) : Object.assign({}, this);
        let flattenedQueryParams = PaginationQueryParams.flattenObject(queryParams);

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

    static flattenObject(input:object){
        let newObject = {}; 

        for(let propName in input){
            let propValue = input[propName];
            if(typeof propValue === "object" && !Array.isArray(propValue)){
                const newPropValue = typeof propValue["buildQueryParams"] === 'function' ? propValue["buildQueryParams"](): propValue; 
                let flattenEmbeddedObject = PaginationQueryParams.flattenObject(newPropValue);

                for(let embeddedPropName in flattenEmbeddedObject){
                    let embeddedPropValue = flattenEmbeddedObject[embeddedPropName];

                    newObject[embeddedPropName] = embeddedPropValue;
                }
            }
            else{
                newObject[propName] = propValue;
            }
        }

        return newObject;
    }
}
