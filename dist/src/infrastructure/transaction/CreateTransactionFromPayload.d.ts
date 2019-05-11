import { Transaction } from '../../model/transaction/Transaction';
/**
 * @internal
 * @param transactionBinary - The transaction binary data
 * @returns {Transaction}
 * @constructor
 */
export declare const CreateTransactionFromPayload: (transactionBinary: string) => Transaction;
