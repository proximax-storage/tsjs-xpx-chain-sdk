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
const assert_1 = require("assert");
const BlockchainScore_1 = require("../../../src/model/blockchain/BlockchainScore");
const UInt64_1 = require("../../../src/model/UInt64");
describe('BlockchainScore', () => {
    it('should createComplete an BlockchainScore object', () => {
        const blockchainScoreDTO = {
            scoreHigh: new UInt64_1.UInt64([0, 0]),
            scoreLow: new UInt64_1.UInt64([0, 0]),
        };
        const blockchainScore = new BlockchainScore_1.BlockchainScore(blockchainScoreDTO.scoreLow, blockchainScoreDTO.scoreHigh);
        assert_1.deepEqual(blockchainScore.scoreLow, blockchainScoreDTO.scoreLow);
        assert_1.deepEqual(blockchainScore.scoreHigh, blockchainScoreDTO.scoreHigh);
    });
});
//# sourceMappingURL=BlockchainScore.spec.js.map