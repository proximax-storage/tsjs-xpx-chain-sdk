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

/**
 * TransactionHash object is used to hold the transaction hash and tranasction type
 */
export class TransactionHash {
    /**
     * @param hash
     * @param type
     */
    constructor(
                /**
                 * Transaction hash
                 */
                public readonly hash: string,
                /**
                 * Transaction type
                 */
                public readonly type: number) {
        if (hash.length !== 64) {
            throw new Error('hash must be 64 characters long');
        }
    }

}