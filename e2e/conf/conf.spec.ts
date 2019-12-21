const conf = require("config");

import { MosaicId, NamespaceId, TransactionType, RegisterNamespaceTransaction, MosaicDefinitionTransaction,
    TransferTransaction, TransactionInfo, MosaicNonce, MosaicProperties, UInt64, BlockInfo, ChainConfigTransaction, TransactionBuilderFactory, NetworkType, Account } from '../../src/model/model';
import { ConfUtils } from './ConfUtils';
import { AccountHttp, TransactionHttp, NamespaceHttp, MosaicHttp, BlockHttp, QueryParams } from '../../src/infrastructure/infrastructure';

// config types
interface ConfApi {
    networkType: string;
    hostname: string;
    protocol: string;
    port: number;
    generationHash: string;
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
    TEST_NEMESIS_ACCOUNT_KEY: string;
    TEST_SEED_ACCOUNT_KEY: string;
    TEST_TEST_ACCOUNT1_KEY: string;
    TEST_TEST_ACCOUNT2_KEY: string;
    TEST_TEST_ACCOUNT3_KEY: string;
    TEST_TEST_ACCOUNT4_KEY: string;
    TEST_TEST_ACCOUNT5_KEY: string;
    TEST_TEST_ACCOUNT6_KEY: string;
    TEST_TEST_ACCOUNT7_KEY: string;
    TEST_TEST_ACCOUNT8_KEY: string;
    TEST_TEST_ACCOUNT9_KEY: string;
    TEST_TEST_ACCOUNT10_KEY: string;
    TEST_TEST_ACCOUNT11_KEY: string;
    TEST_TEST_ACCOUNT12_KEY: string;
    TEST_TEST_ACCOUNT13_KEY: string;
    TEST_TEST_ACCOUNT14_KEY: string;
}

const api = conf.get('api') as ConfApi;
const APIUrl = api.protocol + "://" + api.hostname + ":" + api.port;
const ConfAccountHttp = new AccountHttp(APIUrl);
const ConfTransactionHttp = new TransactionHttp(APIUrl);
const ConfNamespaceHttp = new NamespaceHttp(APIUrl);
const ConfMosaicHttp = new MosaicHttp(APIUrl);

const ConfNetworkType = NetworkType[api.networkType];
const ConfGenerationHash = api.generationHash;

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
        ["nemesis", systemEnv.TEST_NEMESIS_ACCOUNT_KEY],
        ["testing", systemEnv.TEST_TEST_ACCOUNT1_KEY],
        ["recipient", systemEnv.TEST_TEST_ACCOUNT2_KEY],
        ["multisig", systemEnv.TEST_TEST_ACCOUNT3_KEY],
        ["cosignatory1", systemEnv.TEST_TEST_ACCOUNT4_KEY],
        ["cosignatory2", systemEnv.TEST_TEST_ACCOUNT5_KEY],
        ["cosignatory3", systemEnv.TEST_TEST_ACCOUNT6_KEY],
        ["cosignatory4", systemEnv.TEST_TEST_ACCOUNT13_KEY],
        ["cosignatory5", systemEnv.TEST_TEST_ACCOUNT14_KEY],
        ["customer1", systemEnv.TEST_TEST_ACCOUNT7_KEY],
        ["executor1", systemEnv.TEST_TEST_ACCOUNT8_KEY],
        ["executor2", systemEnv.TEST_TEST_ACCOUNT9_KEY],
        ["verifier1", systemEnv.TEST_TEST_ACCOUNT10_KEY],
        ["verifier2", systemEnv.TEST_TEST_ACCOUNT11_KEY],
        ["multilevelmultisig", systemEnv.TEST_TEST_ACCOUNT12_KEY],
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
const NemesisAccount = (accounts.get("nemesis") as unknown as TestAccount).acc;
const TestingAccount = (accounts.get("testing") as unknown as TestAccount).acc;
const TestingRecipient = (accounts.get("recipient") as unknown as TestAccount).acc;
const MultisigAccount = (accounts.get("multisig") as unknown as TestAccount).acc;
const CosignatoryAccount = (accounts.get("cosignatory1") as unknown as TestAccount).acc;
const Cosignatory2Account = (accounts.get("cosignatory2") as unknown as TestAccount).acc;
const Cosignatory3Account = (accounts.get("cosignatory3") as unknown as TestAccount).acc;
const Cosignatory4Account = (accounts.get("cosignatory4") as unknown as TestAccount).acc;
const Cosignatory5Account = (accounts.get("cosignatory5") as unknown as TestAccount).acc;
const Customer1Account = (accounts.get("customer1") as unknown as TestAccount).acc;
const Executor1Account = (accounts.get("executor1") as unknown as TestAccount).acc;
const Executor2Account = (accounts.get("executor2") as unknown as TestAccount).acc;
const Verifier1Account = (accounts.get("verifier1") as unknown as TestAccount).acc;
const Verifier2Account = (accounts.get("verifier2") as unknown as TestAccount).acc;
const MultilevelMultisigAccount = (accounts.get("multilevelmultisig") as unknown as TestAccount).acc;

const AllTestingAccounts = accounts;

console.log("Accounts loaded:");
Array.from(AllTestingAccounts.entries()).forEach(e => {
    console.log(e[0] + ": " + e[1].acc.address.plain());
});

const ConfNamespace = new NamespaceId(getNsId("prx"));
const ConfNamespace2 = new NamespaceId(getNsId("xpx"));
const ConfNetworkMosaic = new MosaicId(getMosId("xpx"));
const ConfNetworkMosaicDivisibility = 6;
const ConfNetworkMosaicName = "xpx";

const ConfTestingMosaicNonce = new MosaicNonce(new Uint8Array([0x01, 0x02, 0x03, 0x04]));
const ConfTestingMosaicId = MosaicId.createFromNonce(ConfTestingMosaicNonce,TestingAccount.publicAccount);
const ConfTestingMosaicProperties = MosaicProperties.create({
    supplyMutable: true,
    transferable: true,
    divisibility: 3,
    duration: UInt64.fromUint(100000)},
);
const ConfTestingNamespaceId = new NamespaceId('testing');

class NemesisBlockInfo {
    private static instance: BlockInfo;
    private constructor() {}
    static async getInstance(): Promise<BlockInfo> {
        if (!NemesisBlockInfo.instance) {
            const blockHttp = new BlockHttp(APIUrl);
            NemesisBlockInfo.instance = await blockHttp.getBlockByHeight(1).toPromise();
        }
        return NemesisBlockInfo.instance;
    }
}

class Configuration {
    private static factory: TransactionBuilderFactory;
    private constructor () {}
    static async getTransactionBuilderFactory(): Promise<TransactionBuilderFactory> {
        if (!Configuration.factory) {
            const newFactory = new TransactionBuilderFactory();
            newFactory.networkType = ConfNetworkType || await NemesisBlockInfo.getInstance().then(blockInfo => blockInfo.networkType);
            newFactory.generationHash = ConfGenerationHash || await NemesisBlockInfo.getInstance().then(blockInfo => blockInfo.generationHash);
            Configuration.factory = newFactory;
        }
        return Configuration.factory;
    }
}

const GetNemesisBlockDataPromise = () => {
    const blockHttp = new BlockHttp(APIUrl);
    return NemesisBlockInfo.getInstance().then((nemesisBlockInfo) => {
        return blockHttp.getBlockTransactions(1, new QueryParams(100)).toPromise()
        .then(txs => {
            const regNamespaceTxs = txs.filter(tx => tx.type === TransactionType.REGISTER_NAMESPACE) as RegisterNamespaceTransaction[];
            const currencyNamespace = regNamespaceTxs.find(tx => tx.namespaceName === "xpx");
            const testNamespace = currencyNamespace ? currencyNamespace : regNamespaceTxs[0];
            const regMosaicTx = txs.find(tx => tx.type === TransactionType.MOSAIC_DEFINITION) as MosaicDefinitionTransaction;
            const transferTx = txs.find(tx => tx.type === TransactionType.TRANSFER) as TransferTransaction;
            const config = txs.find(tx => tx.type === TransactionType.CHAIN_CONFIGURE) as ChainConfigTransaction;

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
                testTxHash: (transferTx.transactionInfo as TransactionInfo).hash as string,
                testTxId: (transferTx.transactionInfo as TransactionInfo).id,
                config,
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
    NemesisBlockInfo,
    Configuration,

    APIUrl,
    ConfAccountHttp,
    ConfMosaicHttp,
    ConfNamespaceHttp,
    ConfTransactionHttp,

    NemesisAccount,
    SeedAccount,
    TestingAccount,
    TestingRecipient,
    MultisigAccount,
    CosignatoryAccount,
    Cosignatory2Account,
    Cosignatory3Account,
    Cosignatory4Account,
    Cosignatory5Account,
    Customer1Account,
    Executor1Account,
    Executor2Account,
    Verifier1Account,
    Verifier2Account,
    MultilevelMultisigAccount,

    AllTestingAccounts,

    ConfTestingMosaicNonce,
    ConfTestingMosaicProperties,
    ConfTestingMosaicId,
    ConfTestingNamespaceId,

    ConfNamespace,
    ConfNamespace2,
    ConfNetworkMosaic,
    ConfNetworkMosaicName,
    ConfNetworkMosaicDivisibility
};
