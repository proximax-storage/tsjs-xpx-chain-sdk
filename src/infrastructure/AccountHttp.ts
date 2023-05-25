/*
 * Copyright 2023 ProximaX
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import {AccountInfo} from '../model/account/AccountInfo';
import { AccountNames } from '../model/account/AccountNames';
import { AccountRestrictionsInfo } from '../model/account/AccountRestrictionsInfo';
import {Address} from '../model/account/Address';
import {MultisigAccountGraphInfo} from '../model/account/MultisigAccountGraphInfo';
import {MultisigAccountInfo} from '../model/account/MultisigAccountInfo';
import {PublicAccount} from '../model/account/PublicAccount';
import {Mosaic} from '../model/mosaic/Mosaic';
import {MosaicId} from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { NamespaceName } from '../model/namespace/NamespaceName';
import {AggregateTransaction} from '../model/transaction/AggregateTransaction';
import {Transaction} from '../model/transaction/Transaction';
import {TransactionSearch} from '../model/transaction/TransactionSearch';
import {UInt64} from '../model/UInt64';
import {AccountRepository} from './AccountRepository';
import { AccountInfoDTO,
         AccountRoutesApi,
         TransactionRoutesApi,
         AccountInfoResponse,
         AccountsInfoResponse,
         MosaicDTO, 
         AccountPropertiesInfoResponse,
         AccountsPropertiesInfoResponse,
         AccountsNamesResponse,
         AccountNamesDTO,
         MultisigAccountInfoResponse,
         MultisigAccountGraphInfoResponse,
         MultisigAccountGraphInfoDTO,
         TransactionSearchResponse
        } from './api';
import {Http} from './Http';
import {NetworkHttp} from './NetworkHttp';
import {TransactionQueryParams} from './TransactionQueryParams';
import {CreateTransactionFromDTO} from './transaction/CreateTransactionFromDTO';
import {TransactionGroupType} from '../model/transaction/TransactionGroupType'
import { RequestOptions } from './RequestOptions';
import { Pagination } from '../model/Pagination';
import { NetworkType } from '../model/model';

/**
 * Account http repository.
 *
 * @since 1.0
 */
export class AccountHttp extends Http implements AccountRepository {
    /**
     * @internal
     * xpx chain Library account routes api
     */
    private accountRoutesApi: AccountRoutesApi;
    private url: string;
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.url = url;
        this.accountRoutesApi = new AccountRoutesApi(url);
    }

    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    public getAccountInfo(address: Address, requestOptions?: RequestOptions): Observable<AccountInfo> {
        return observableFrom(this.accountRoutesApi.getAccountInfo(address.plain(), requestOptions)).pipe(
            map((response: AccountInfoResponse) => {
                const accountInfoDTO = response.body;
                return new AccountInfo(
                    accountInfoDTO.meta,
                    Address.createFromEncoded(accountInfoDTO.account.address),
                    new UInt64(accountInfoDTO.account.addressHeight),
                    accountInfoDTO.account.publicKey,
                    new UInt64(accountInfoDTO.account.publicKeyHeight),
                    accountInfoDTO.account.accountType.valueOf(),
                    accountInfoDTO.account.linkedAccountKey,
                    accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic(
                        new MosaicId(mosaicDTO.id),
                        new UInt64(mosaicDTO.amount),
                    )),
                );
            })
        );
    }

    /**
     * Get Account restrictions.
     * @param publicAccount public account
     * @returns Observable<AccountRestrictionsInfo>
     */
    public getAccountRestrictions(address: Address, requestOptions?: RequestOptions): Observable<AccountRestrictionsInfo> {
        return observableFrom(this.accountRoutesApi.getAccountProperties(address.plain(), requestOptions))
            .pipe(map((response: AccountPropertiesInfoResponse) => {
            return DtoMapping.extractAccountRestrictionFromDto(response.body);
        }));
    }

    /**
     * Get Account restrictions.
     * @param address list of addresses
     * @returns Observable<AccountRestrictionsInfo[]>
     */
    public getAccountRestrictionsFromAccounts(addresses: Address[], requestOptions?: RequestOptions): Observable<AccountRestrictionsInfo[]> {
        const accountIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.accountRoutesApi.getAccountPropertiesFromAccounts(accountIds, requestOptions))
                .pipe(map((response: AccountsPropertiesInfoResponse) => {
            return response.body.map((restriction) => {
                return DtoMapping.extractAccountRestrictionFromDto(restriction);
            });
        }));
    }

    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    public getAccountsInfo(addresses: Address[], requestOptions?: RequestOptions): Observable<AccountInfo[]> {
        const accountIdsBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.accountRoutesApi.getAccountsInfo(accountIdsBody, requestOptions))
            .pipe(map((response: AccountsInfoResponse) => {
                return response.body.map((accountInfoDTO: AccountInfoDTO) => {
                    return new AccountInfo(
                        accountInfoDTO.meta,
                        Address.createFromEncoded(accountInfoDTO.account.address),
                        new UInt64(accountInfoDTO.account.addressHeight),
                        accountInfoDTO.account.publicKey,
                        new UInt64(accountInfoDTO.account.publicKeyHeight),
                        accountInfoDTO.account.accountType.valueOf(),
                        accountInfoDTO.account.linkedAccountKey,
                        accountInfoDTO.account.mosaics.map((mosaicDTO: MosaicDTO) =>
                            new Mosaic(new MosaicId(mosaicDTO.id), new UInt64(mosaicDTO.amount))),
                    );
                });
            }));
    }

    public getAccountsNames(addresses: Address[], requestOptions?: RequestOptions): Observable<AccountNames[]> {
        const accountIdsBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.accountRoutesApi.getAccountsNames(accountIdsBody, requestOptions)).pipe(map((response: AccountsNamesResponse) => {
            return response.body.map((accountName: AccountNamesDTO) => {
                return new AccountNames(
                    Address.createFromEncoded(accountName.address),
                    accountName.names.map((name) => {
                        return new NamespaceName(new NamespaceId(name), name);
                    }),
                );
            });
        }));
    }
    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountInfo>
     */
    public getMultisigAccountInfo(address: Address, requestOptions?: RequestOptions): Observable<MultisigAccountInfo> {
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.accountRoutesApi.getAccountMultisig(address.plain(), requestOptions))
                    .pipe(map((response: MultisigAccountInfoResponse) => {
                        const multisigAccountInfoDTO = response.body;
                return new MultisigAccountInfo(
                    PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.account, networkType),
                    multisigAccountInfoDTO.multisig.minApproval,
                    multisigAccountInfoDTO.multisig.minRemoval,
                    multisigAccountInfoDTO.multisig.cosignatories
                        .map((cosigner: string) => PublicAccount.createFromPublicKey(cosigner, networkType)),
                    multisigAccountInfoDTO.multisig.multisigAccounts
                        .map((multisigAccount: string) => PublicAccount.createFromPublicKey(multisigAccount, networkType)),
                );
            }))));
    }

    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountGraphInfo>
     */
    public getMultisigAccountGraphInfo(address: Address, requestOptions?: RequestOptions): Observable<MultisigAccountGraphInfo> {
        return this.getNetworkTypeObservable(requestOptions).pipe(
            mergeMap((networkType: NetworkType) => observableFrom(
                this.accountRoutesApi.getAccountMultisigGraph(address.plain(), requestOptions))
                    .pipe(map((response: MultisigAccountGraphInfoResponse) => {
                const multisigAccounts = new Map<number, MultisigAccountInfo[]>();
                response.body.map((multisigAccountGraphInfoDTO: MultisigAccountGraphInfoDTO) => {
                    multisigAccounts.set(multisigAccountGraphInfoDTO.level,
                        multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
                            return new MultisigAccountInfo(
                                PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.account, networkType),
                                multisigAccountInfoDTO.multisig.minApproval,
                                multisigAccountInfoDTO.multisig.minRemoval,
                                multisigAccountInfoDTO.multisig.cosignatories
                                    .map((cosigner) => PublicAccount.createFromPublicKey(cosigner, networkType)),
                                multisigAccountInfoDTO.multisig.multisigAccounts
                                    .map((multisigAccountDTO) => PublicAccount.createFromPublicKey(multisigAccountDTO, networkType)));
                        }),
                    );
                });
                return new MultisigAccountGraphInfo(multisigAccounts);
            }))));
    }

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param publicAccount - User public account
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<Transaction[]>
     */
    public transactions(publicAccount: PublicAccount, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable<Transaction[]> {
        const plainAddress = publicAccount.address.plain();
        return observableFrom(
            this.accountRoutesApi.transactions(plainAddress, txnQueryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                let transactions : Transaction[] = [];
                transactions = response.body.data.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
                return transactions;
            }));
    }

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param publicAccount - User public account
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<TransactionSearch>
     */
     public transactionsWithPagination(publicAccount: PublicAccount, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable<TransactionSearch> {
        const plainAddress = publicAccount.address.plain();
        return observableFrom(
            this.accountRoutesApi.transactions(plainAddress, txnQueryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                let transactions : Transaction[] = [];
                transactions = response.body.data.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new TransactionSearch(transactions, paginationData);
            }));
    }

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param accountId - User public account or address (you can use address if public account is not known to the network just yet)
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<Transaction[]>
     */
    public incomingTransactions(accountId: PublicAccount | Address, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable <Transaction[]> {
        const plainAddress = accountId instanceof PublicAccount ? (accountId as PublicAccount).address.plain() : (accountId as Address).plain();
        return observableFrom(
            this.accountRoutesApi.incomingTransactions(plainAddress, txnQueryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                if(response.body.data.length){
                    return response.body.data.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    });
                }
                else{
                    return [];
                }
            }));
    }

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param accountId - User public account or address (you can use address if public account is not known to the network just yet)
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<TransactionSearch>
     */
     public incomingTransactionsWithPagination(accountId: PublicAccount | Address, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable <TransactionSearch> {
        const plainAddress = accountId instanceof PublicAccount ? (accountId as PublicAccount).address.plain() : (accountId as Address).plain();
        return observableFrom(
            this.accountRoutesApi.incomingTransactions(plainAddress, txnQueryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                let transactions : Transaction[] = [];
                transactions = response.body.data.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new TransactionSearch(transactions, paginationData);
            }));
    }

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param publicAccount - User public account
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<Transaction[]>
     */
    public outgoingTransactions(publicAccount: PublicAccount, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.outgoingTransactions(publicAccount.publicKey, txnQueryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                if(response.body.data.length){
                    return response.body.data.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    });
                }
                else{
                    return [];
                }
            }));
    }

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param publicAccount - User public account
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<TransactionSearch>
     */
     public outgoingTransactionsWithPagination(publicAccount: PublicAccount, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable <TransactionSearch> {
        return observableFrom(
            this.accountRoutesApi.outgoingTransactions(publicAccount.publicKey, txnQueryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                let transactions : Transaction[] = [];
                transactions = response.body.data.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new TransactionSearch(transactions, paginationData);
            }));
    }

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param publicAccount - User public account
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<Transaction[]>
     */
    public unconfirmedTransactions(publicAccount: PublicAccount, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable <Transaction[]> {
        const plainAddress = publicAccount.address.plain();
        return observableFrom(
            this.accountRoutesApi.unconfirmedTransactions(plainAddress, txnQueryParams, requestOptions)).pipe(
            map((response: TransactionSearchResponse) => {
                if(response.body.data.length){
                    return response.body.data.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    });
                }
                else{
                    return [];
                }
            }));
    }

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param publicAccount - User public account
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<TransactionSearch>
     */
     public unconfirmedTransactionsWithPagination(publicAccount: PublicAccount, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable <TransactionSearch> {
        const plainAddress = publicAccount.address.plain();
        return observableFrom(
            this.accountRoutesApi.unconfirmedTransactions(plainAddress, txnQueryParams, requestOptions))
            .pipe(
            map((response: TransactionSearchResponse) => {
                let transactions : Transaction[] = [];
                transactions = response.body.data.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
                let paginationData = new Pagination(
                    response.body.pagination.totalEntries, 
                    response.body.pagination.pageNumber,
                    response.body.pagination.pageSize,
                    response.body.pagination.totalPages
                );
                return new TransactionSearch(transactions, paginationData);
            }));
    }

    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param publicAccount - User public account
     * @param txnQueryParams - (Optional) Transaction Query params
     * @returns Observable<AggregateTransaction[]>
     */
    public aggregateBondedTransactions(publicAccount: PublicAccount, txnQueryParams?: TransactionQueryParams, requestOptions?: RequestOptions): Observable <AggregateTransaction[]> {
        const plainAddress = publicAccount.address.plain();
        // let transactionRoutesApi = getCompleteTransaction ? new TransactionRoutesApi(this.url) : null;

        let firstObservable = observableFrom(
            this.accountRoutesApi.partialTransactions(plainAddress, txnQueryParams, requestOptions))
            .pipe(                                   
                map((response: TransactionSearchResponse) => {
                    if(response.body.data.length){
                        return response.body.data.map((transactionDTO) => {
                                return CreateTransactionFromDTO(transactionDTO) as AggregateTransaction;
                        });
                    }
                    else{
                        //return new TransactionSearch([], response.body.pagination);
                        return [];
                    }
                })
            );

        return firstObservable;
    }
}