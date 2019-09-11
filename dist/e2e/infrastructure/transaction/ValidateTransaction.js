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
const chai_1 = require("chai");
const MultisigCosignatoryModification_1 = require("../../../src/model/transaction/MultisigCosignatoryModification");
const TransactionType_1 = require("../../../src/model/transaction/TransactionType");
const UInt64_1 = require("../../../src/model/UInt64");
const Address_1 = require("../../../src/model/account/Address");
const NamespaceId_1 = require("../../../src/model/namespace/NamespaceId");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const PublicAccount_1 = require("../../../src/model/account/PublicAccount");
const ValidateTransaction = {
    validateStandaloneTx: (transaction, transactionDTO) => {
        assert_1.deepEqual(transaction.transactionInfo.height, new UInt64_1.UInt64(transactionDTO.meta.height));
        chai_1.expect(transaction.transactionInfo.hash)
            .to.be.equal(transactionDTO.meta.hash);
        chai_1.expect(transaction.transactionInfo.merkleComponentHash)
            .to.be.equal(transactionDTO.meta.merkleComponentHash);
        chai_1.expect(transaction.transactionInfo.index)
            .to.be.equal(transactionDTO.meta.index);
        chai_1.expect(transaction.transactionInfo.id)
            .to.be.equal(transactionDTO.meta.id);
        chai_1.expect(transaction.signature)
            .to.be.equal(transactionDTO.transaction.signature);
        chai_1.expect(transaction.signer.publicKey)
            .to.be.equal(transactionDTO.transaction.signer);
        chai_1.expect(transaction.networkType)
            .to.be.equal(parseInt(transactionDTO.transaction.version.toString(16).substr(0, 2), 16));
        chai_1.expect(transaction.version)
            .to.be.equal(parseInt(transactionDTO.transaction.version.toString(16).substr(2, 2), 16));
        chai_1.expect(transaction.type)
            .to.be.equal(transactionDTO.transaction.type);
        assert_1.deepEqual(transaction.maxFee, new UInt64_1.UInt64(transactionDTO.transaction.maxFee));
        assert_1.deepEqual(transaction.deadline.toDTO(), transactionDTO.transaction.deadline);
        if (transaction.type === TransactionType_1.TransactionType.TRANSFER) {
            ValidateTransaction.validateTransferTx(transaction, transactionDTO);
        }
        else if (transaction.type === TransactionType_1.TransactionType.REGISTER_NAMESPACE) {
            ValidateTransaction.validateNamespaceCreationTx(transaction, transactionDTO);
        }
        else if (transaction.type === TransactionType_1.TransactionType.MOSAIC_DEFINITION) {
            ValidateTransaction.validateMosaicCreationTx(transaction, transactionDTO);
        }
        else if (transaction.type === TransactionType_1.TransactionType.MOSAIC_SUPPLY_CHANGE) {
            ValidateTransaction.validateMosaicSupplyChangeTx(transaction, transactionDTO);
        }
        else if (transaction.type === TransactionType_1.TransactionType.MODIFY_MULTISIG_ACCOUNT) {
            ValidateTransaction.validateMultisigModificationTx(transaction, transactionDTO);
        }
    },
    validateAggregateTx: (aggregateTransaction, aggregateTransactionDTO) => {
        assert_1.deepEqual(aggregateTransaction.transactionInfo.height, new UInt64_1.UInt64(aggregateTransactionDTO.meta.height));
        chai_1.expect(aggregateTransaction.transactionInfo.hash)
            .to.be.equal(aggregateTransactionDTO.meta.hash);
        chai_1.expect(aggregateTransaction.transactionInfo.merkleComponentHash)
            .to.be.equal(aggregateTransactionDTO.meta.merkleComponentHash);
        chai_1.expect(aggregateTransaction.transactionInfo.index)
            .to.be.equal(aggregateTransactionDTO.meta.index);
        chai_1.expect(aggregateTransaction.transactionInfo.id)
            .to.be.equal(aggregateTransactionDTO.meta.id);
        chai_1.expect(aggregateTransaction.signature)
            .to.be.equal(aggregateTransactionDTO.transaction.signature);
        chai_1.expect(aggregateTransaction.signer.publicKey)
            .to.be.equal(aggregateTransactionDTO.transaction.signer);
        chai_1.expect(aggregateTransaction.networkType)
            .to.be.equal(parseInt(aggregateTransactionDTO.transaction.version.toString(16).substr(0, 2), 16));
        chai_1.expect(aggregateTransaction.version)
            .to.be.equal(parseInt(aggregateTransactionDTO.transaction.version.toString(16).substr(2, 2), 16));
        chai_1.expect(aggregateTransaction.type)
            .to.be.equal(aggregateTransactionDTO.transaction.type);
        assert_1.deepEqual(aggregateTransaction.maxFee, new UInt64_1.UInt64(aggregateTransactionDTO.transaction.maxFee));
        assert_1.deepEqual(aggregateTransaction.deadline.toDTO(), aggregateTransactionDTO.transaction.deadline);
        ValidateTransaction.validateStandaloneTx(aggregateTransaction.innerTransactions[0], aggregateTransactionDTO.transaction.transactions[0]);
    },
    validateMosaicCreationTx: (mosaicDefinitionTransaction, mosaicDefinitionTransactionDTO) => {
        if (mosaicDefinitionTransaction.parentId !== undefined ||
            mosaicDefinitionTransactionDTO.transaction.parentId !== undefined) {
            assert_1.deepEqual(mosaicDefinitionTransaction.parentId, new MosaicId_1.MosaicId(mosaicDefinitionTransactionDTO.transaction.parentId));
        }
        assert_1.deepEqual(mosaicDefinitionTransaction.mosaicId, new MosaicId_1.MosaicId(mosaicDefinitionTransactionDTO.transaction.mosaicId));
        chai_1.expect(mosaicDefinitionTransaction.mosaicName)
            .to.be.equal(mosaicDefinitionTransactionDTO.transaction.name);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.divisibility)
            .to.be.equal(mosaicDefinitionTransactionDTO.transaction.properties[1].value[0]);
        assert_1.deepEqual(mosaicDefinitionTransaction.mosaicProperties.duration, new UInt64_1.UInt64(mosaicDefinitionTransactionDTO.transaction.properties[2].value));
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable)
            .to.be.equal(true);
        chai_1.expect(mosaicDefinitionTransaction.mosaicProperties.transferable)
            .to.be.equal(true);
    },
    validateMosaicSupplyChangeTx: (mosaicSupplyChangeTransaction, mosaicSupplyChangeTransactionDTO) => {
        assert_1.deepEqual(mosaicSupplyChangeTransaction.mosaicId, new MosaicId_1.MosaicId(mosaicSupplyChangeTransactionDTO.transaction.mosaicId));
        chai_1.expect(mosaicSupplyChangeTransaction.direction)
            .to.be.equal(mosaicSupplyChangeTransactionDTO.transaction.direction);
        assert_1.deepEqual(mosaicSupplyChangeTransaction.delta, new UInt64_1.UInt64(mosaicSupplyChangeTransactionDTO.transaction.delta));
    },
    validateMultisigModificationTx: (modifyMultisigAccountTransaction, modifyMultisigAccountTransactionDTO) => {
        chai_1.expect(modifyMultisigAccountTransaction.minApprovalDelta)
            .to.be.equal(modifyMultisigAccountTransactionDTO.transaction.minApprovalDelta);
        chai_1.expect(modifyMultisigAccountTransaction.minRemovalDelta)
            .to.be.equal(modifyMultisigAccountTransactionDTO.transaction.minRemovalDelta);
        assert_1.deepEqual(modifyMultisigAccountTransaction.modifications[0], new MultisigCosignatoryModification_1.MultisigCosignatoryModification(modifyMultisigAccountTransactionDTO.transaction.modifications[0].type, PublicAccount_1.PublicAccount.createFromPublicKey(modifyMultisigAccountTransactionDTO.transaction.modifications[0].cosignatoryPublicKey, modifyMultisigAccountTransaction.networkType)));
    },
    validateNamespaceCreationTx: (registerNamespaceTransaction, registerNamespaceTransactionDTO) => {
        chai_1.expect(registerNamespaceTransaction.namespaceType)
            .to.be.equal(registerNamespaceTransactionDTO.transaction.namespaceType);
        chai_1.expect(registerNamespaceTransaction.namespaceName)
            .to.be.equal(registerNamespaceTransactionDTO.transaction.name);
        assert_1.deepEqual(registerNamespaceTransaction.namespaceId, new NamespaceId_1.NamespaceId(registerNamespaceTransactionDTO.transaction.namespaceId));
        if (registerNamespaceTransaction.namespaceType === 0) {
            assert_1.deepEqual(registerNamespaceTransaction.duration, new UInt64_1.UInt64(registerNamespaceTransactionDTO.transaction.duration));
        }
        else {
            assert_1.deepEqual(registerNamespaceTransaction.parentId, new NamespaceId_1.NamespaceId(registerNamespaceTransactionDTO.transaction.parentId));
        }
    },
    validateTransferTx: (transferTransaction, transferTransactionDTO) => {
        assert_1.deepEqual(transferTransaction.recipient, Address_1.Address.createFromEncoded(transferTransactionDTO.transaction.recipient));
        if (transferTransactionDTO.transaction.message) {
            chai_1.expect(transferTransaction.message.payload)
                .to.be.equal("test-message");
        }
        else {
            chai_1.expect(transferTransaction.message.payload)
                .to.be.equal("");
        }
    },
};
exports.default = ValidateTransaction;
//# sourceMappingURL=ValidateTransaction.js.map