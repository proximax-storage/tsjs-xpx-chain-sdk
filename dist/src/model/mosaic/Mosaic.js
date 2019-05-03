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
 * A mosaic describes an instance of a mosaic definition.
 * Mosaics can be transferred by means of a transfer transaction.
 */
class Mosaic {
    /**
     * Constructor
     * @param id
     * @param amount
     */
    constructor(
    /**
     * The mosaic id
     */
    id, 
    /**
     * The mosaic amount. The quantity is always given in smallest units for the mosaic
     * i.e. if it has a divisibility of 3 the quantity is given in millis.
     */
    amount) {
        this.id = id;
        this.amount = amount;
    }
    /**
     * @internal
     * @returns {{amount: number[], id: number[]}}
     */
    toDTO() {
        return {
            amount: this.amount.toDTO(),
            id: this.id.id.toDTO(),
        };
    }
}
exports.Mosaic = Mosaic;
//# sourceMappingURL=Mosaic.js.map