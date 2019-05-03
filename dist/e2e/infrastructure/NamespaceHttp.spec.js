"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const NamespaceHttp_1 = require("../../src/infrastructure/NamespaceHttp");
const PublicAccount_1 = require("../../src/model/account/PublicAccount");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const NetworkCurrencyMosaic_1 = require("../../src/model/mosaic/NetworkCurrencyMosaic");
const conf_spec_1 = require("../conf/conf.spec");
describe('NamespaceHttp', () => {
    const namespaceId = NetworkCurrencyMosaic_1.NetworkCurrencyMosaic.NAMESPACE_ID;
    const publicAccount = PublicAccount_1.PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF', NetworkType_1.NetworkType.MIJIN_TEST);
    const namespaceHttp = new NamespaceHttp_1.NamespaceHttp(conf_spec_1.APIUrl);
    describe('getNamespace', () => {
        it('should return namespace data given namepsaceId', (done) => {
            namespaceHttp.getNamespace(namespaceId)
                .subscribe((namespace) => {
                chai_1.expect(namespace.startHeight.lower).to.be.equal(1);
                chai_1.expect(namespace.startHeight.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('getNamespacesFromAccount', () => {
        it('should return namespace data given publicKeyNemesis', (done) => {
            namespaceHttp.getNamespacesFromAccount(publicAccount.address)
                .subscribe((namespaces) => {
                chai_1.expect(namespaces[0].startHeight.lower).to.be.equal(1);
                chai_1.expect(namespaces[0].startHeight.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('getNamespacesFromAccounts', () => {
        it('should return namespaces data given publicKeyNemesis', (done) => {
            namespaceHttp.getNamespacesFromAccounts([publicAccount.address])
                .subscribe((namespaces) => {
                chai_1.expect(namespaces[0].startHeight.lower).to.be.equal(1);
                chai_1.expect(namespaces[0].startHeight.higher).to.be.equal(0);
                done();
            });
        });
    });
    describe('getNamespacesName', () => {
        it('should return namespace name given array of namespaceIds', (done) => {
            namespaceHttp.getNamespacesName([namespaceId])
                .subscribe((namespaceNames) => {
                chai_1.expect(namespaceNames[0].name).to.be.equal('nem');
                done();
            });
        });
    });
    describe('getLinkedMosaicId', () => {
        it('should return mosaicId given currency namespaceId', (done) => {
            namespaceHttp.getLinkedMosaicId(namespaceId)
                .subscribe((mosaicId) => {
                chai_1.expect(mosaicId).to.not.be.null;
                done();
            });
        });
    });
    describe('getLinkedAddress', () => {
        it('should return address given namespaceId', (done) => {
            namespaceHttp.getLinkedAddress(namespaceId)
                .subscribe((address) => {
                chai_1.expect(address).to.be.null;
                done();
            });
        });
    });
});
//# sourceMappingURL=NamespaceHttp.spec.js.map