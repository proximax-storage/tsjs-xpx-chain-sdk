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
 * Static class containing network type constants.
 */
var NetworkType;
(function (NetworkType) {
    /**
     * Main net network
     * @type {number}
     */
    NetworkType[NetworkType["MAIN_NET"] = 184] = "MAIN_NET";
    /**
     * Test net network
     * @type {number}
     */
    NetworkType[NetworkType["TEST_NET"] = 168] = "TEST_NET";
    /**
     * Private network
     * @type {number}
     */
    NetworkType[NetworkType["PRIVATE"] = 200] = "PRIVATE";
    /**
     * Private test network
     * @type {number}
     */
    NetworkType[NetworkType["PRIVATE_TEST"] = 176] = "PRIVATE_TEST";
    /**
     * Mijin net network
     * @type {number}
     */
    NetworkType[NetworkType["MIJIN"] = 96] = "MIJIN";
    /**
     * Mijin test net network
     * @type {number}
     */
    NetworkType[NetworkType["MIJIN_TEST"] = 144] = "MIJIN_TEST";
})(NetworkType = exports.NetworkType || (exports.NetworkType = {}));
//# sourceMappingURL=NetworkType.js.map