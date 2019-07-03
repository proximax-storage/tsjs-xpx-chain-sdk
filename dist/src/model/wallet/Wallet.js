"use strict";
/*
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wallet base model
 */
class Wallet {
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param schema
     */
    constructor(
    /**
     * The wallet's name
     */
    name, 
    /**
     * The wallet's network
     */
    network, 
    /**
     * The wallet's address
     */
    address, 
    /**
     * The wallet's creation date
     */
    creationDate, 
    /**
     * Wallet schema number
     */
    schema) {
        this.name = name;
        this.network = network;
        this.address = address;
        this.creationDate = creationDate;
        this.schema = schema;
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map