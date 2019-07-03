import { PublicAccount } from '../account/PublicAccount';
import { Transaction } from './Transaction';
/**
 * Transaction with signer included, used when adding signer to transactions included in an aggregate transaction.
 */
export declare type InnerTransaction = Transaction & {
    signer: PublicAccount;
};
