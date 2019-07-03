import { TestAccount } from "./conf.spec";
import { Account, Address, MosaicId, AccountInfo, NamespaceId } from "../../src/model/model";
import { TransactionHttp, Listener } from "../../src/infrastructure/infrastructure";
export declare class ConfUtils {
    static waitForConfirmation(listener: Listener, onAddress: Address, callback: any, hash?: string): void;
    static prepareE2eTestData(): Promise<{}>;
    static checkIfNeedMsig(ta: TestAccount): Promise<void>;
    static checkIfNeedPubKey(ta: TestAccount, accountInfo: AccountInfo): Promise<AccountInfo>;
    static seed(ta: TestAccount): Promise<AccountInfo>;
    static getOrCreate(ta: TestAccount): Promise<AccountInfo>;
    static simpleCreateAndAnnounceWaitForConfirmation(address: Address, absoluteAmount: number, from?: Account, message?: string): Promise<void>;
    static convertToMultisig(ta: TestAccount): Promise<void>;
    static simplePropertyModificationBLockAddress(account: Account, blockAddress: Address, transactionHttp?: TransactionHttp): Promise<{}>;
    static checkOrCreateRootNamespace(namespaceId: NamespaceId): Promise<{}>;
    static checkOrCreateMosaic(mosaicId: MosaicId): Promise<{}>;
}
