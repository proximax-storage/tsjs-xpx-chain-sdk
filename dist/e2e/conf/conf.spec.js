"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const conf = require("config");
const Account_1 = require("../../src/model/account/Account");
const NetworkType_1 = require("../../src/model/blockchain/NetworkType");
const model_1 = require("../../src/model/model");
const ConfUtils_1 = require("./ConfUtils");
const BlockHttp_1 = require("../../src/infrastructure/BlockHttp");
const QueryParams_1 = require("../../src/infrastructure/QueryParams");
const infrastructure_1 = require("../../src/infrastructure/infrastructure");
const api = conf.get('api');
const APIUrl = api.protocol + "://" + api.hostname + ":" + api.port;
exports.APIUrl = APIUrl;
const ConfAccountHttp = new infrastructure_1.AccountHttp(APIUrl);
exports.ConfAccountHttp = ConfAccountHttp;
const ConfTransactionHttp = new infrastructure_1.TransactionHttp(APIUrl);
exports.ConfTransactionHttp = ConfTransactionHttp;
const ConfNamespaceHttp = new infrastructure_1.NamespaceHttp(APIUrl);
exports.ConfNamespaceHttp = ConfNamespaceHttp;
const ConfMosaicHttp = new infrastructure_1.MosaicHttp(APIUrl);
exports.ConfMosaicHttp = ConfMosaicHttp;
const ConfNetworkType = NetworkType_1.NetworkType[api.networkType];
exports.ConfNetworkType = ConfNetworkType;
const blockchain = conf.get('blockchain');
const systemEnv = process.env;
//test types
class TestAccount {
    constructor(confAccount, customPK) {
        this.cosignatories = [];
        this.cosigns = [];
        this.conf = confAccount;
        this.acc = Account_1.Account.createFromPrivateKey(customPK || confAccount.pk, ConfNetworkType);
    }
    hasCosignatories() {
        return this.cosignatories && this.cosignatories.length ? true : false;
    }
    isCosignatory() {
        return this.cosigns && this.cosigns.length ? true : false;
    }
}
exports.TestAccount = TestAccount;
// helpers
const loadEnvKeys = () => {
    return new Map([
        ["seed", systemEnv.TEST_SEED_ACCOUNT_KEY],
        ["testing", systemEnv.TEST_TEST_ACCOUNT1_KEY],
        ["recipient", systemEnv.TEST_TEST_ACCOUNT2_KEY],
        ["multisig", systemEnv.TEST_TEST_ACCOUNT3_KEY],
        ["cosignatory1", systemEnv.TEST_TEST_ACCOUNT4_KEY],
        ["cosignatory2", systemEnv.TEST_TEST_ACCOUNT5_KEY],
        ["cosignatory3", systemEnv.TEST_TEST_ACCOUNT6_KEY],
        ["customer1", systemEnv.TEST_TEST_ACCOUNT7_KEY],
        ["executor1", systemEnv.TEST_TEST_ACCOUNT8_KEY],
        ["executor2", systemEnv.TEST_TEST_ACCOUNT9_KEY],
        ["verifier1", systemEnv.TEST_TEST_ACCOUNT10_KEY],
        ["verifier2", systemEnv.TEST_TEST_ACCOUNT11_KEY],
    ]);
};
const loadBlockchainConfAccouns = (conf) => {
    const envKeys = loadEnvKeys();
    const map = new Map(conf.accounts.map(a => {
        return [a.alias, new TestAccount(a, envKeys.get(a.alias))];
    }));
    map.forEach((val, key, map) => {
        if (val.conf.cosignatories) {
            val.conf.cosignatories.forEach(cos => {
                const c = map.get(cos);
                val.cosignatories.push(c);
                c.cosigns.push(val);
            });
        }
    });
    return map;
};
const getNsId = (alias) => {
    const ns = blockchain.namespaces.find(n => n.alias === alias);
    return ns ? ns.id : undefined;
};
const getMosId = (alias) => {
    const mos = blockchain.mosaics.find(m => m.alias === alias);
    return mos ? mos.id : undefined;
};
const accounts = loadBlockchainConfAccouns(blockchain);
const SeedAccount = accounts.get("seed").acc;
exports.SeedAccount = SeedAccount;
const TestingAccount = accounts.get("testing").acc;
exports.TestingAccount = TestingAccount;
const TestingRecipient = accounts.get("recipient").acc;
exports.TestingRecipient = TestingRecipient;
const MultisigAccount = accounts.get("multisig").acc;
exports.MultisigAccount = MultisigAccount;
const CosignatoryAccount = accounts.get("cosignatory1").acc;
exports.CosignatoryAccount = CosignatoryAccount;
const Cosignatory2Account = accounts.get("cosignatory2").acc;
exports.Cosignatory2Account = Cosignatory2Account;
const Cosignatory3Account = accounts.get("cosignatory3").acc;
exports.Cosignatory3Account = Cosignatory3Account;
const Customer1Account = accounts.get("customer1").acc;
exports.Customer1Account = Customer1Account;
const Executor1Account = accounts.get("executor1").acc;
exports.Executor1Account = Executor1Account;
const Executor2Account = accounts.get("executor2").acc;
exports.Executor2Account = Executor2Account;
const Verifier1Account = accounts.get("verifier1").acc;
exports.Verifier1Account = Verifier1Account;
const Verifier2Account = accounts.get("verifier2").acc;
exports.Verifier2Account = Verifier2Account;
const AllTestingAccounts = accounts;
exports.AllTestingAccounts = AllTestingAccounts;
console.log("Accounts loaded:");
Array.from(AllTestingAccounts.entries()).forEach(e => {
    console.log(e[0] + ": " + e[1].acc.address.plain());
});
const ConfNamespace = new model_1.NamespaceId(getNsId("prx"));
exports.ConfNamespace = ConfNamespace;
const ConfNamespace2 = new model_1.NamespaceId(getNsId("xpx"));
exports.ConfNamespace2 = ConfNamespace2;
const ConfNetworkMosaic = new model_1.MosaicId(getMosId("xpx"));
exports.ConfNetworkMosaic = ConfNetworkMosaic;
const ConfNetworkMosaicDivisibility = 6;
exports.ConfNetworkMosaicDivisibility = ConfNetworkMosaicDivisibility;
const ConfNetworkMosaicName = "xpx";
exports.ConfNetworkMosaicName = ConfNetworkMosaicName;
const ConfTestingMosaicNonce = new model_1.MosaicNonce(new Uint8Array([0x01, 0x02, 0x03, 0x04]));
exports.ConfTestingMosaicNonce = ConfTestingMosaicNonce;
const ConfTestingMosaic = model_1.MosaicId.createFromNonce(ConfTestingMosaicNonce, TestingAccount.publicAccount);
exports.ConfTestingMosaic = ConfTestingMosaic;
const ConfTestingMosaicProperties = model_1.MosaicProperties.create({
    supplyMutable: true,
    transferable: true,
    divisibility: 3,
    duration: model_1.UInt64.fromUint(1000)
});
exports.ConfTestingMosaicProperties = ConfTestingMosaicProperties;
const ConfTestingNamespace = new model_1.NamespaceId('testing');
exports.ConfTestingNamespace = ConfTestingNamespace;
class NemesisBlockInfo {
    constructor() { }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!NemesisBlockInfo.instance) {
                const blockHttp = new BlockHttp_1.BlockHttp(APIUrl);
                NemesisBlockInfo.instance = yield blockHttp.getBlockByHeight(1).toPromise();
            }
            return NemesisBlockInfo.instance;
        });
    }
}
exports.NemesisBlockInfo = NemesisBlockInfo;
const GetNemesisBlockDataPromise = () => {
    const blockHttp = new BlockHttp_1.BlockHttp(APIUrl);
    return NemesisBlockInfo.getInstance().then((nemesisBlockInfo) => {
        return blockHttp.getBlockTransactions(1, new QueryParams_1.QueryParams(100)).toPromise()
            .then(txs => {
            const regNamespaceTxs = txs.filter(tx => tx.type === model_1.TransactionType.REGISTER_NAMESPACE);
            const currencyNamespace = regNamespaceTxs.find(tx => tx.namespaceName === "currency");
            const testNamespace = currencyNamespace ? currencyNamespace : regNamespaceTxs[0];
            const regMosaicTx = txs.find(tx => tx.type === model_1.TransactionType.MOSAIC_DEFINITION);
            const transferTx = txs.find(tx => tx.type === model_1.TransactionType.TRANSFER);
            return {
                nemesisBlockInfo,
                testNamespace: {
                    Id: testNamespace.namespaceId,
                    Name: testNamespace.namespaceName,
                },
                otherTestNamespace: {
                    Id: regNamespaceTxs[0].namespaceId,
                    Name: regNamespaceTxs[0].namespaceName,
                },
                testTxHash: transferTx.transactionInfo.hash,
                testTxId: transferTx.transactionInfo.id,
            };
        });
    });
};
exports.GetNemesisBlockDataPromise = GetNemesisBlockDataPromise;
describe("Prepare environment.", () => {
    it('should run', (done) => {
        ConfUtils_1.ConfUtils.prepareE2eTestData().then(() => {
            done();
        });
    });
});
//# sourceMappingURL=conf.spec.js.map