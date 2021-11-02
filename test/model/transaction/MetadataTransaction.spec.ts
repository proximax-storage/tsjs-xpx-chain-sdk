// Copyright 2021 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file


import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {Address} from '../../../src/model/account/Address';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {Convert} from '../../../src/core/format/Convert';
import {TestingAccount} from '../../conf/conf.spec';

import { MosaicMetadataTransaction, NamespaceMetadataTransaction, AccountMetadataTransaction } from '../../../src/model/model';
import { convert } from '@js-joda/core';
import { KeyGenerator } from '../../..';

describe('MetadataTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });
    describe('size', () => {
        it('should return 181 for MosaicMetadataTransaction byte size with oldValue=test, newValue=testing', () => {
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const modifyMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(),
                account.publicAccount,
                mosaicId,
                "name",
                "testing",
                "test",
                NetworkType.MIJIN_TEST,
                UInt64.fromUint(0)
            );
            const signedTransaction = modifyMetadataTransaction.signWith(account, generationHash);

            expect(modifyMetadataTransaction.size).to.be.equal(181);
            expect(signedTransaction.payload.length).to.be.equal(181 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal( TestingAccount.publicKey + "859CBD19B98E068F" + Convert.uint8ToHex(Convert.hexToUint8Reverse(mosaicId.toHex())) + '0300070000000000696E67');
        });
        it('should return 181 for namespace MetadataTransaction byte size with oldValue=testing, newValue=test', () => {
            const namespaceId = new NamespaceId([2262289484, 3405110546]);
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(),
                account.publicAccount,
                namespaceId,
                "name",
                "test",
                "testing",
                NetworkType.MIJIN_TEST,
                UInt64.fromUint(0)
            );
            const signedTransaction = namespaceMetadataTransaction.signWith(account, generationHash);

            expect(namespaceMetadataTransaction.size).to.be.equal(181);
            expect(signedTransaction.payload.length).to.be.equal(181 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal( TestingAccount.publicKey + "859CBD19B98E068F" + Convert.uint8ToHex(Convert.hexToUint8Reverse(namespaceId.toHex())) + 'FDFF070000000000696E67');
        });

        it('should return 173 for accountMetadataTransaction byte size with oldValue="", newValue=testing', () => {
            const accounteMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(),
                account.publicAccount,
                "name",
                "testing",
                "",
                NetworkType.MIJIN_TEST,
                UInt64.fromUint(0)
            );
            const signedTransaction = accounteMetadataTransaction.signWith(account, generationHash);

            expect(accounteMetadataTransaction.size).to.be.equal(173);
            expect(signedTransaction.payload.length).to.be.equal(173 * 2);
            expect(signedTransaction.payload.substring(
                244,
                signedTransaction.payload.length,
            )).to.be.equal( TestingAccount.publicKey + "859CBD19B98E068F" + '0700070074657374696E67');
        });
    });
});
