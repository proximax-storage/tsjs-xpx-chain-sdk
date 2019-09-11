"use strict";
/*
 * Copyright 2019 NEM
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
 * The server information.
 */
class ServerInfo {
    /**
     * @param restVersion - The catapult-rest component version
     * @param sdkVersion - the catapult-sdk component version
     */
    constructor(/**
                 * The catapult-rest component version
                 */ restVersion, 
    /**
     * the catapult-sdk component version
     */
    sdkVersion) {
        this.restVersion = restVersion;
        this.sdkVersion = sdkVersion;
    }
}
exports.ServerInfo = ServerInfo;
//# sourceMappingURL=ServerInfo.js.map