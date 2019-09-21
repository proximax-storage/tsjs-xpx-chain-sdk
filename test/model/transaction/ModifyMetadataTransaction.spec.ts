// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {Address} from '../../../src/model/account/Address';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';
import { ModifyMetadataTransaction, MetadataModification, MetadataModificationType, NamespaceId } from '../../../src/model/model';

describe('MetadataTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });
    describe('size', () => {
        it('should return 149 for mosaic MetadataTransaction byte size with add key1=value1', () => {
            const modification = new MetadataModification(MetadataModificationType.ADD, "key1", "value1");
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
                NetworkType.MIJIN_TEST,
                Deadline.create(),
                mosaicId,
                [modification],
                UInt64.fromUint(0)
            );
            const signedTransaction = modifyMetadataTransaction.signWith(account, generationHash);

            expect(modifyMetadataTransaction.size).to.be.equal(149);
            expect(signedTransaction.payload.length).to.be.equal(149 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal('024CCCD78612DDF5CA12000000000406006B65793176616C756531');
        });
        it('should return 167 for namespace MetadataTransaction byte size with add key1=value1 and key2=value2', () => {
            const modification1 = new MetadataModification(MetadataModificationType.ADD, "key1", "value1");
            const modification2 = new MetadataModification(MetadataModificationType.ADD, "key2", "value2");
            const namespaceId = new NamespaceId([2262289484, 3405110546]);
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithNamespaceId(
                NetworkType.MIJIN_TEST,
                Deadline.create(),
                namespaceId,
                [modification1, modification2],
                UInt64.fromUint(0)
            );
            const signedTransaction = modifyMetadataTransaction.signWith(account, generationHash);

            expect(modifyMetadataTransaction.size).to.be.equal(167);
            expect(signedTransaction.payload.length).to.be.equal(167 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal('034CCCD78612DDF5CA12000000000406006B65793176616C75653112000000000406006B65793276616C756532');
        });

        it('should return 166 for address MetadataTransaction byte size with add key1=value1', () => {
            const modification = new MetadataModification(MetadataModificationType.ADD, "key1", "value1");
            const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const modifyMetadataTransaction = ModifyMetadataTransaction.createWithAddress(
                NetworkType.MIJIN_TEST,
                Deadline.create(),
                address,
                [modification],
                UInt64.fromUint(0)
            );
            const signedTransaction = modifyMetadataTransaction.signWith(account, generationHash);

            expect(modifyMetadataTransaction.size).to.be.equal(166);
            expect(signedTransaction.payload.length).to.be.equal(166 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal('019050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E14212000000000406006B65793176616C756531');
        });
    });
});
