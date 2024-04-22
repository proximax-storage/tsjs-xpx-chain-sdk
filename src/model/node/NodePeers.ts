/*
 * Copyright 2024 ProximaX
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
 * The node peers of a node.
 */
export class NodePeers {

    /**
     * @param peersInfo
     */
    constructor(/**
                 * The peers info
                 */
                public readonly peersInfo: PeerInfo[]){}
}

export class PeerInfo{

    constructor(
        public readonly publicKey: string,
        public readonly port: number,
        public readonly networkIdentifier: number,
        public readonly version: number,
        public readonly roles: number,
        public readonly host: string, 
        public readonly friendlyName: string 
        ){

    }
}