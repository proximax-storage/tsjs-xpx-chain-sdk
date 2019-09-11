import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
export declare class TransactionUtils {
    static createAndAnnounce(recipient?: Address, transactionHttp?: TransactionHttp): Promise<import("../../src/model/model").TransactionAnnounceResponse>;
    static createAndAnnounceWithInsufficientBalance(transactionHttp?: TransactionHttp): Promise<import("rxjs").Observable<import("../../src/model/model").TransactionAnnounceResponse>>;
    static createAggregateBondedTransactionAndAnnounce(transactionHttp?: TransactionHttp): Promise<unknown>;
    static cosignTransaction(transaction: AggregateTransaction, account: Account, transactionHttp?: TransactionHttp): void;
    static createModifyMultisigAccountTransaction(account: PublicAccount, type: MultisigCosignatoryModificationType, transactionHttp?: TransactionHttp): Promise<import("rxjs").Observable<import("../../src/model/model").TransactionAnnounceResponse>>;
}
