import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
export declare class TransactionUtils {
    static createAndAnnounce(recipient?: Address, transactionHttp?: TransactionHttp): void;
    static createAndAnnounceWithInsufficientBalance(transactionHttp?: TransactionHttp): void;
    static createAggregateBoundedTransactionAndAnnounce(transactionHttp?: TransactionHttp): void;
    static cosignTransaction(transaction: AggregateTransaction, account: Account, transactionHttp?: TransactionHttp): void;
    static createModifyMultisigAccountTransaction(account: Account, transactionHttp?: TransactionHttp): void;
}
