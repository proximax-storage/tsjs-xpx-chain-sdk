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
const js_xpx_catapult_library_1 = require("js-xpx-catapult-library");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const PublicAccount_1 = require("../model/account/PublicAccount");
const BlockchainScore_1 = require("../model/blockchain/BlockchainScore");
const BlockchainStorageInfo_1 = require("../model/blockchain/BlockchainStorageInfo");
const BlockInfo_1 = require("../model/blockchain/BlockInfo");
const UInt64_1 = require("../model/UInt64");
const Http_1 = require("./Http");
const CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
class BlockchainHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     */
    constructor(url) {
        super(url);
        this.blockchainRoutesApi = new js_xpx_catapult_library_1.BlockchainRoutesApi(this.apiClient);
    }
    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    getBlockByHeight(height) {
        return rxjs_1.from(this.blockchainRoutesApi.getBlockByHeight(height)).pipe(operators_1.map((blockDTO) => {
            const networkType = parseInt(blockDTO.block.version.toString(16).substr(0, 2), 16);
            return new BlockInfo_1.BlockInfo(blockDTO.meta.hash, blockDTO.meta.generationHash, new UInt64_1.UInt64(blockDTO.meta.totalFee), blockDTO.meta.numTransactions, blockDTO.block.signature, PublicAccount_1.PublicAccount.createFromPublicKey(blockDTO.block.signer, networkType), networkType, parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version
            blockDTO.block.type, new UInt64_1.UInt64(blockDTO.block.height), new UInt64_1.UInt64(blockDTO.block.timestamp), new UInt64_1.UInt64(blockDTO.block.difficulty), blockDTO.block.feeMultiplier, blockDTO.block.previousBlockHash, blockDTO.block.blockTransactionsHash, blockDTO.block.blockReceiptsHash, blockDTO.block.stateHash, CreateTransactionFromDTO_1.extractBeneficiary(blockDTO, networkType));
        }));
    }
    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    getBlockTransactions(height, queryParams) {
        return rxjs_1.from(this.blockchainRoutesApi.getBlockTransactions(height, queryParams != null ? queryParams : {})).pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned
     * @returns Observable<BlockInfo[]>
     */
    getBlocksByHeightWithLimit(height, limit = 1) {
        return rxjs_1.from(this.blockchainRoutesApi.getBlocksByHeightWithLimit(height, limit)).pipe(operators_1.map((blocksDTO) => {
            return blocksDTO.map((blockDTO) => {
                const networkType = parseInt(blockDTO.block.version.toString(16).substr(0, 2), 16);
                return new BlockInfo_1.BlockInfo(blockDTO.meta.hash, blockDTO.meta.generationHash, new UInt64_1.UInt64(blockDTO.meta.totalFee), blockDTO.meta.numTransactions, blockDTO.block.signature, PublicAccount_1.PublicAccount.createFromPublicKey(blockDTO.block.signer, networkType), networkType, parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version
                blockDTO.block.type, new UInt64_1.UInt64(blockDTO.block.height), new UInt64_1.UInt64(blockDTO.block.timestamp), new UInt64_1.UInt64(blockDTO.block.difficulty), blockDTO.block.feeMultiplier, blockDTO.block.previousBlockHash, blockDTO.block.blockTransactionsHash, blockDTO.block.blockReceiptsHash, blockDTO.block.stateHash, CreateTransactionFromDTO_1.extractBeneficiary(blockDTO, networkType));
            });
        }));
    }
    /**
     * Gets current blockchain height
     * @returns Observable<UInt64>
     */
    getBlockchainHeight() {
        return rxjs_1.from(this.blockchainRoutesApi.getBlockchainHeight()).pipe(operators_1.map((heightDTO) => {
            return new UInt64_1.UInt64(heightDTO.height);
        }));
    }
    /**
     * Gets current blockchain score
     * @returns Observable<BlockchainScore>
     */
    getBlockchainScore() {
        return rxjs_1.from(this.blockchainRoutesApi.getBlockchainScore()).pipe(operators_1.map((blockchainScoreDTO) => {
            return new BlockchainScore_1.BlockchainScore(new UInt64_1.UInt64(blockchainScoreDTO.scoreLow), new UInt64_1.UInt64(blockchainScoreDTO.scoreHigh));
        }));
    }
    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    getDiagnosticStorage() {
        return rxjs_1.from(this.blockchainRoutesApi.getDiagnosticStorage()).pipe(operators_1.map((blockchainStorageInfoDTO) => {
            return new BlockchainStorageInfo_1.BlockchainStorageInfo(blockchainStorageInfoDTO.numBlocks, blockchainStorageInfoDTO.numTransactions, blockchainStorageInfoDTO.numAccounts);
        }));
    }
}
exports.BlockchainHttp = BlockchainHttp;
//# sourceMappingURL=BlockchainHttp.js.map