import { Observable } from 'rxjs';
import { AccountInfo } from '../model/account/AccountInfo';
import { AccountNames } from '../model/account/AccountNames';
import { AccountRestrictionsInfo } from '../model/account/AccountRestrictionsInfo';
import { Address } from '../model/account/Address';
import { MultisigAccountGraphInfo } from '../model/account/MultisigAccountGraphInfo';
import { MultisigAccountInfo } from '../model/account/MultisigAccountInfo';
import { PublicAccount } from '../model/account/PublicAccount';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { AccountRepository } from './AccountRepository';
import { Http } from './Http';
import { NetworkHttp } from './NetworkHttp';
import { QueryParams } from './QueryParams';
/**
 * Account http repository.
 *
 * @since 1.0
 */
export declare class AccountHttp extends Http implements AccountRepository {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp);
    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    getAccountInfo(address: Address): Observable<AccountInfo>;
    /**
     * Get Account restrictions.
     * @param publicAccount public account
     * @returns Observable<AccountRestrictionsInfo>
     */
    getAccountRestrictions(address: Address): Observable<AccountRestrictionsInfo>;
    /**
     * Get Account restrictions.
     * @param address list of addresses
     * @returns Observable<AccountRestrictionsInfo[]>
     */
    getAccountRestrictionsFromAccounts(addresses: Address[]): Observable<AccountRestrictionsInfo[]>;
    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]>;
    getAccountsNames(addresses: Address[]): Observable<AccountNames[]>;
    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountInfo>
     */
    getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo>;
    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountGraphInfo>
     */
    getMultisigAccountGraphInfo(address: Address): Observable<MultisigAccountGraphInfo>;
    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    transactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable<Transaction[]>;
    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    incomingTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable<Transaction[]>;
    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    outgoingTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable<Transaction[]>;
    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    unconfirmedTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable<Transaction[]>;
    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<AggregateTransaction[]>
     */
    aggregateBondedTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable<AggregateTransaction[]>;
}
