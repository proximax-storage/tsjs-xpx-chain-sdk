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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const NodeInfo_1 = require("../model/node/NodeInfo");
const NodeTime_1 = require("../model/node/NodeTime");
const api_1 = require("./api");
const Http_1 = require("./Http");
/**
 * Node http repository.
 *
 * @since 1.0
 */
class NodeHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     */
    constructor(url) {
        super();
        this.nodeRoutesApi = new api_1.NodeRoutesApi(url);
    }
    /**
     * Supplies additional information about the application running on a node.
     * @summary Get the node information
     */
    getNodeInfo() {
        return rxjs_1.from(this.nodeRoutesApi.getNodeInfo()).pipe(operators_1.map((nodeInfoDTO) => {
            return new NodeInfo_1.NodeInfo(nodeInfoDTO.publicKey, nodeInfoDTO.port, nodeInfoDTO.networkIdentifier, nodeInfoDTO.version, nodeInfoDTO.roles, nodeInfoDTO.host, nodeInfoDTO.friendlyName);
        }));
    }
    /**
     * Gets the node time at the moment the reply was sent and received.
     * @summary Get the node time
     */
    getNodeTime() {
        return rxjs_1.from(this.nodeRoutesApi.getNodeTime()).pipe(operators_1.map((nodeTimeDTO) => {
            return new NodeTime_1.NodeTime(nodeTimeDTO.communicationTimestamps.sendTimestamp, nodeTimeDTO.communicationTimestamps.receiveTimestamp);
        }));
    }
}
exports.NodeHttp = NodeHttp;
//# sourceMappingURL=NodeHttp.js.map