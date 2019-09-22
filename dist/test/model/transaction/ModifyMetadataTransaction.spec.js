"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Address_1 = require("../../../src/model/account/Address");
const NetworkType_1 = require("../../../src/model/blockchain/NetworkType");
const MosaicId_1 = require("../../../src/model/mosaic/MosaicId");
const Deadline_1 = require("../../../src/model/transaction/Deadline");
const UInt64_1 = require("../../../src/model/UInt64");
const conf_spec_1 = require("../../conf/conf.spec");
const model_1 = require("../../../src/model/model");
describe('MetadataTransaction', () => {
    let account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = conf_spec_1.TestingAccount;
    });
    describe('size', () => {
        it('should return 149 for mosaic MetadataTransaction byte size with add key1=value1', () => {
            const modification = new model_1.MetadataModification(model_1.MetadataModificationType.ADD, "key1", "value1");
            const mosaicId = new MosaicId_1.MosaicId([2262289484, 3405110546]);
            const modifyMetadataTransaction = model_1.ModifyMetadataTransaction.createWithMosaicId(NetworkType_1.NetworkType.MIJIN_TEST, Deadline_1.Deadline.create(), mosaicId, [modification], UInt64_1.UInt64.fromUint(0));
            const signedTransaction = modifyMetadataTransaction.signWith(account, generationHash);
            chai_1.expect(modifyMetadataTransaction.size).to.be.equal(149);
            chai_1.expect(signedTransaction.payload.length).to.be.equal(149 * 2);
            chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('024CCCD78612DDF5CA12000000000406006B65793176616C756531');
        });
        it('should return 167 for namespace MetadataTransaction byte size with add key1=value1 and key2=value2', () => {
            const modification1 = new model_1.MetadataModification(model_1.MetadataModificationType.ADD, "key1", "value1");
            const modification2 = new model_1.MetadataModification(model_1.MetadataModificationType.ADD, "key2", "value2");
            const namespaceId = new model_1.NamespaceId([2262289484, 3405110546]);
            const modifyMetadataTransaction = model_1.ModifyMetadataTransaction.createWithNamespaceId(NetworkType_1.NetworkType.MIJIN_TEST, Deadline_1.Deadline.create(), namespaceId, [modification1, modification2], UInt64_1.UInt64.fromUint(0));
            const signedTransaction = modifyMetadataTransaction.signWith(account, generationHash);
            chai_1.expect(modifyMetadataTransaction.size).to.be.equal(167);
            chai_1.expect(signedTransaction.payload.length).to.be.equal(167 * 2);
            chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('034CCCD78612DDF5CA12000000000406006B65793176616C75653112000000000406006B65793276616C756532');
        });
        it('should return 166 for address MetadataTransaction byte size with add key1=value1', () => {
            const modification = new model_1.MetadataModification(model_1.MetadataModificationType.ADD, "key1", "value1");
            const address = Address_1.Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const modifyMetadataTransaction = model_1.ModifyMetadataTransaction.createWithAddress(NetworkType_1.NetworkType.MIJIN_TEST, Deadline_1.Deadline.create(), address, [modification], UInt64_1.UInt64.fromUint(0));
            const signedTransaction = modifyMetadataTransaction.signWith(account, generationHash);
            chai_1.expect(modifyMetadataTransaction.size).to.be.equal(166);
            chai_1.expect(signedTransaction.payload.length).to.be.equal(166 * 2);
            chai_1.expect(signedTransaction.payload.substring(244, signedTransaction.payload.length)).to.be.equal('019050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E14212000000000406006B65793176616C756531');
        });
    });
});
//# sourceMappingURL=ModifyMetadataTransaction.spec.js.map