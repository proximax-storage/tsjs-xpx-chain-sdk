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
const PublicAccount_1 = require("../model/account/PublicAccount");
const BlockInfo_1 = require("../model/blockchain/BlockInfo");
const MerklePathItem_1 = require("../model/blockchain/MerklePathItem");
const MerkleProofInfo_1 = require("../model/blockchain/MerkleProofInfo");
const MerkleProofInfoPayload_1 = require("../model/blockchain/MerkleProofInfoPayload");
const UInt64_1 = require("../model/UInt64");
const api_1 = require("./api");
const Http_1 = require("./Http");
const NetworkHttp_1 = require("./NetworkHttp");
const CreateReceiptFromDTO_1 = require("./receipt/CreateReceiptFromDTO");
const CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
/**
 * Blocks returned limits:
 * N_25: 25 blocks.
 * N_50: 50 blocks.
 * N_75: 75 blocks.
 * N_100: 100 blocks.
 */
var LimitType;
(function (LimitType) {
    LimitType[LimitType["N_25"] = 25] = "N_25";
    LimitType[LimitType["N_50"] = 50] = "N_50";
    LimitType[LimitType["N_75"] = 75] = "N_75";
    LimitType[LimitType["N_100"] = 100] = "N_100";
})(LimitType = exports.LimitType || (exports.LimitType = {}));
/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
class BlockHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url, networkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp_1.NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.blockRoutesApi = new api_1.BlockRoutesApi(url);
    }
    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    getBlockByHeight(height) {
        return rxjs_1.from(this.blockRoutesApi.getBlockByHeight(height)).pipe(operators_1.map((blockDTO) => {
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
        return rxjs_1.from(this.blockRoutesApi.getBlockTransactions(height, this.queryParams(queryParams).pageSize, this.queryParams(queryParams).id, this.queryParams(queryParams).order))
            .pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned. Limit value only available in 25, 50. 75 and 100. (default 25)
     * @returns Observable<BlockInfo[]>
     */
    getBlocksByHeightWithLimit(height, limit = LimitType.N_25) {
        return rxjs_1.from(this.blockRoutesApi.getBlocksByHeightWithLimit(height, limit)).pipe(operators_1.map((blocksDTO) => {
            return blocksDTO.map((blockDTO) => {
                const networkType = parseInt(blockDTO.block.version.toString(16).substr(0, 2), 16);
                return new BlockInfo_1.BlockInfo(blockDTO.meta.hash, blockDTO.meta.generationHash, new UInt64_1.UInt64(blockDTO.meta.totalFee), blockDTO.meta.numTransactions, blockDTO.block.signature, PublicAccount_1.PublicAccount.createFromPublicKey(blockDTO.block.signer, networkType), networkType, parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version
                blockDTO.block.type, new UInt64_1.UInt64(blockDTO.block.height), new UInt64_1.UInt64(blockDTO.block.timestamp), new UInt64_1.UInt64(blockDTO.block.difficulty), blockDTO.block.feeMultiplier, blockDTO.block.previousBlockHash, blockDTO.block.blockTransactionsHash, blockDTO.block.blockReceiptsHash, blockDTO.block.stateHash, CreateTransactionFromDTO_1.extractBeneficiary(blockDTO, networkType));
            });
        }));
    }
    /**
     * Get the merkle path for a given a receipt statement hash and block
     * Returns the merkle path for a [receipt statement or resolution](https://nemtech.github.io/concepts/receipt.html)
     * linked to a block. The path is the complementary data needed to calculate the merkle root.
     * A client can compare if the calculated root equals the one recorded in the block header,
     * verifying that the receipt was linked with the block.
     * @param height The height of the block.
     * @param hash The hash of the receipt statement or resolution.
     * @return Observable<MerkleProofInfo>
     */
    getMerkleReceipts(height, hash) {
        return rxjs_1.from(this.blockRoutesApi.getMerkleReceipts(height, hash)).pipe(operators_1.map((merkleProofReceipt) => {
            return new MerkleProofInfo_1.MerkleProofInfo(new MerkleProofInfoPayload_1.MerkleProofInfoPayload(merkleProofReceipt.payload.merklePath.map((payload) => new MerklePathItem_1.MerklePathItem(payload.position, payload.hash))), merkleProofReceipt.type);
        }));
    }
    /**
     * Get the merkle path for a given a transaction and block
     * Returns the merkle path for a [transaction](https://nemtech.github.io/concepts/transaction.html)
     * included in a block. The path is the complementary data needed to calculate the merkle root.
     * A client can compare if the calculated root equals the one recorded in the block header,
     * verifying that the transaction was included in the block.
     * @param height The height of the block.
     * @param hash The hash of the transaction.
     * @return Observable<MerkleProofInfo>
     */
    getMerkleTransaction(height, hash) {
        return rxjs_1.from(this.blockRoutesApi.getMerkleReceipts(height, hash)).pipe(operators_1.map((merkleProofTransaction) => {
            return new MerkleProofInfo_1.MerkleProofInfo(new MerkleProofInfoPayload_1.MerkleProofInfoPayload(merkleProofTransaction.payload.merklePath.map((payload) => new MerklePathItem_1.MerklePathItem(payload.position, payload.hash))), merkleProofTransaction.type);
        }));
    }
    /**
     * Gets an array receipts for a block height.
     * @param height - Block height from which will be the first block in the array
     * @param queryParams - (Optional) Query params
     * @returns Observable<Statement>
     */
    getBlockReceipts(height) {
        return this.getNetworkTypeObservable().pipe(operators_1.mergeMap((networkType) => rxjs_1.from(this.blockRoutesApi.getBlockReceipts(height)).pipe(operators_1.map((receiptDTO) => {
            return CreateReceiptFromDTO_1.CreateStatementFromDTO(receiptDTO, networkType);
        }))));
    }
}
exports.BlockHttp = BlockHttp;
//# sourceMappingURL=BlockHttp.js.map