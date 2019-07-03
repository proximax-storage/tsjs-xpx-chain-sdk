import { Account } from '../../src/model/account/Account';
import { MosaicId, NamespaceId, MosaicNonce, MosaicProperties, BlockInfo } from '../../src/model/model';
import { AccountHttp, TransactionHttp, NamespaceHttp, MosaicHttp } from '../../src/infrastructure/infrastructure';
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
declare const APIUrl: string;
declare const ConfAccountHttp: AccountHttp;
declare const ConfTransactionHttp: TransactionHttp;
declare const ConfNamespaceHttp: NamespaceHttp;
declare const ConfMosaicHttp: MosaicHttp;
declare const ConfNetworkType: any;
declare class TestAccount {
    readonly conf: ConfAccount;
    readonly acc: Account;
    cosignatories: TestAccount[];
    cosigns: TestAccount[];
    constructor(confAccount: ConfAccount, customPK?: string);
    hasCosignatories(): boolean;
    isCosignatory(): boolean;
}
declare const SeedAccount: Account;
declare const TestingAccount: Account;
declare const TestingRecipient: Account;
declare const MultisigAccount: Account;
declare const CosignatoryAccount: Account;
declare const Cosignatory2Account: Account;
declare const Cosignatory3Account: Account;
declare const Customer1Account: Account;
declare const Executor1Account: Account;
declare const Executor2Account: Account;
declare const Verifier1Account: Account;
declare const Verifier2Account: Account;
declare const AllTestingAccounts: Map<string, TestAccount>;
declare const ConfNamespace: NamespaceId;
declare const ConfNamespace2: NamespaceId;
declare const ConfNetworkMosaic: MosaicId;
declare const ConfNetworkMosaicDivisibility = 6;
declare const ConfNetworkMosaicName = "xpx";
declare const ConfTestingMosaicNonce: MosaicNonce;
declare const ConfTestingMosaic: MosaicId;
declare const ConfTestingMosaicProperties: MosaicProperties;
declare const ConfTestingNamespace: NamespaceId;
declare class NemesisBlockInfo {
    private static instance;
    private constructor();
    static getInstance(): Promise<BlockInfo>;
}
declare const GetNemesisBlockDataPromise: () => Promise<{
    nemesisBlockInfo: BlockInfo;
    testNamespace: {
        Id: NamespaceId;
        Name: string;
    };
    otherTestNamespace: {
        Id: NamespaceId;
        Name: string;
    };
    testTxHash: string;
    testTxId: string;
}>;
export { TestAccount, GetNemesisBlockDataPromise, NemesisBlockInfo, APIUrl, ConfAccountHttp, ConfMosaicHttp, ConfNamespaceHttp, ConfTransactionHttp, ConfNetworkType, SeedAccount, TestingAccount, TestingRecipient, MultisigAccount, CosignatoryAccount, Cosignatory2Account, Cosignatory3Account, Customer1Account, Executor1Account, Executor2Account, Verifier1Account, Verifier2Account, AllTestingAccounts, ConfTestingMosaicNonce, ConfTestingMosaicProperties, ConfTestingMosaic, ConfTestingNamespace, ConfNamespace, ConfNamespace2, ConfNetworkMosaic, ConfNetworkMosaicName, ConfNetworkMosaicDivisibility };
