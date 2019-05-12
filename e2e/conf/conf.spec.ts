const conf = require("config");

import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { MosaicId, NamespaceId, TransactionType, RegisterNamespaceTransaction, MosaicDefinitionTransaction,
    TransferTransaction, TransactionInfo, MosaicNonce, MosaicProperties, UInt64 } from '../../src/model/model';
import { ConfUtils } from './ConfUtils';
import { BlockchainHttp } from '../../src/infrastructure/BlockchainHttp';
import { QueryParams } from '../../src/infrastructure/QueryParams';

// config types
interface ConfApi {
    networkType: string;
    hostname: string;
    protocol: string;
    port: number;
}

interface ConfAccount {
    alias: string;
    pk: string;
    seed: number;
    cosignatories: string[];
    minApproval: number;
    minRemoval: number;
}

interface ConfNamespace {
    alias: string;
    id: number[];
}

interface ConfMocaic {
    alias: string;
    id: number[];
}

interface ConfBlockchain {
    accounts: ConfAccount[];
    namespaces: ConfNamespace[];
    mosaics: ConfMocaic[];
}

interface ConfEnv {
    TEST_SEED_ACCOUNT_KEY: string;
    TEST_TEST_ACCOUNT1_KEY: string;
    TEST_TEST_ACCOUNT2_KEY: string;
    TEST_TEST_ACCOUNT3_KEY: string;
    TEST_TEST_ACCOUNT4_KEY: string;
    TEST_TEST_ACCOUNT5_KEY: string;
    TEST_TEST_ACCOUNT6_KEY: string;
}

const api = conf.get('api') as ConfApi;
const APIUrl = api.protocol + "://" + api.hostname + ":" + api.port;
const ConfNetworkType = NetworkType[api.networkType];

const blockchain = conf.get('blockchain') as ConfBlockchain;
const systemEnv = process.env as unknown as ConfEnv;

//test types
class TestAccount {
    public readonly conf: ConfAccount;
    public readonly acc: Account;
    public cosignatories: TestAccount[] = [];
    public cosigns: TestAccount[] = [];

    constructor(confAccount: ConfAccount, customPK?: string) {
        this.conf = confAccount;
        this.acc = Account.createFromPrivateKey(customPK || confAccount.pk, ConfNetworkType);
    }

    hasCosignatories() {
        return this.cosignatories && this.cosignatories.length ? true : false;
    }

    isCosignatory() {
        return this.cosigns && this.cosigns.length ? true: false;
    }
}

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
    ])
}
const loadBlockchainConfAccouns = (conf: ConfBlockchain) => {
    const envKeys = loadEnvKeys();
    const map = new Map(
        conf.accounts.map(a => {
            return [a.alias, new TestAccount(a, envKeys.get(a.alias))]
        })
    )
    map.forEach((val, key, map) => {
        if (val.conf.cosignatories) {
            val.conf.cosignatories.forEach(cos => {
                const c = map.get(cos) as unknown as TestAccount
                val.cosignatories.push(c);
                c.cosigns.push(val);
            });
        }
    });
    return map;
}

const getNsId = (alias: string) => {
    const ns = blockchain.namespaces.find(n => n.alias === alias);
    return ns ? ns.id : undefined as unknown as number[];
}

const getMosId = (alias: string) => {
    const mos = blockchain.mosaics.find(m => m.alias === alias);
    return mos ? mos.id : undefined as unknown as number[];
}

const accounts = loadBlockchainConfAccouns(blockchain);

const SeedAccount = (accounts.get("seed") as unknown as TestAccount).acc;
const TestingAccount = (accounts.get("testing") as unknown as TestAccount).acc;
const TestingRecipient = (accounts.get("recipient") as unknown as TestAccount).acc;
const MultisigAccount = (accounts.get("multisig") as unknown as TestAccount).acc;
const CosignatoryAccount = (accounts.get("cosignatory1") as unknown as TestAccount).acc;
const Cosignatory2Account = (accounts.get("cosignatory2") as unknown as TestAccount).acc;
const Cosignatory3Account = (accounts.get("cosignatory3") as unknown as TestAccount).acc;

const AllTestingAccounts = accounts;

console.log("Accounts loaded:");
Array.from(AllTestingAccounts.entries()).forEach(e => {
    console.log(e[0] + ": " + e[1].acc.address.plain());
});

const ConfNamespace = new NamespaceId(getNsId("prx"));
const ConfNamespace2 = new NamespaceId(getNsId("xpx"));
const ConfNetworkMosaic = new MosaicId(getMosId("xpx"));
const ConfNetworkMosaicName = "xpx";

const ConfTestingMosaicNonce = new MosaicNonce(new Uint8Array([0x01, 0x02, 0x03, 0x04]));
const ConfTestingMosaic = MosaicId.createFromNonce(ConfTestingMosaicNonce,TestingAccount.publicAccount);
const ConfTestingMosaicProperties = MosaicProperties.create({
    supplyMutable: true,
    transferable: true,
    levyMutable: true,
    divisibility: 3,
    duration: UInt64.fromUint(1000)},
);
const ConfTestingNamespace = new NamespaceId('testing');

const GetNemesisBlockDataPromise = () => {
    const blockchainHttp = new BlockchainHttp(APIUrl);
    return blockchainHttp.getBlockByHeight(1).toPromise().then((nemesisBlockInfo) => {
        return new BlockchainHttp(APIUrl).getBlockTransactions(1, new QueryParams(100)).toPromise()
        .then(txs => {
            const regNamespaceTxs = txs.filter(tx => tx.type === TransactionType.REGISTER_NAMESPACE) as RegisterNamespaceTransaction[];
            const currencyNamespace = regNamespaceTxs.find(tx => tx.namespaceName === "currency");
            const someNamespace = currencyNamespace ? currencyNamespace : regNamespaceTxs[0];
            const regMosaicTx = txs.find(tx => tx.type === TransactionType.MOSAIC_DEFINITION) as MosaicDefinitionTransaction;
            const transferTx = txs.find(tx => tx.type === TransactionType.TRANSFER) as TransferTransaction;

            return {
                nemesisBlockInfo,
                someNamespace: {
                    Id: someNamespace.namespaceId,
                    Name: someNamespace.namespaceName,
                },
                otherNamespace: {
                    Id: regNamespaceTxs[0].namespaceId,
                    Name: regNamespaceTxs[0].namespaceName,
                },
                someTxHash: (transferTx.transactionInfo as TransactionInfo).hash as string,
                someTxId: (transferTx.transactionInfo as TransactionInfo).id,
            }
        });    
    });
}

describe("Prepare environment.", () => {
    it ('should run', (done) => {
        ConfUtils.prepareE2eTestData().then(() => {
            done();
        });    
    });
});

export {
    TestAccount,
    GetNemesisBlockDataPromise,

    APIUrl,
    ConfNetworkType,
    SeedAccount,
    TestingAccount,
    TestingRecipient,
    MultisigAccount,
    CosignatoryAccount,
    Cosignatory2Account,
    Cosignatory3Account,

    AllTestingAccounts,

    ConfTestingMosaicNonce,
    ConfTestingMosaicProperties,
    ConfTestingMosaic,
    ConfTestingNamespace,

    ConfNamespace,
    ConfNamespace2,
    ConfNetworkMosaic,
    ConfNetworkMosaicName,
};
