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

import {deepStrictEqual} from 'assert';
import {BlockchainScore} from '../../../src/model/blockchain/BlockchainScore';
import {UInt64} from '../../../src/model/UInt64';

describe('BlockchainScore', () => {

    it('should createComplete an BlockchainScore object', () => {
        const blockchainScoreDTO = {
            scoreHigh: new UInt64([0, 0]),
            scoreLow: new UInt64([0, 0]),
        };

        const blockchainScore = new BlockchainScore(
            blockchainScoreDTO.scoreLow,
            blockchainScoreDTO.scoreHigh,
        );

        deepStrictEqual(blockchainScore.scoreLow, blockchainScoreDTO.scoreLow);
        deepStrictEqual(blockchainScore.scoreHigh, blockchainScoreDTO.scoreHigh);
    });
});
