"use strict";
/*
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
Object.defineProperty(exports, "__esModule", { value: true });
const js_xpx_catapult_library_1 = require("js-xpx-catapult-library");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const AccountInfo_1 = require("../model/account/AccountInfo");
const AccountPropertiesInfo_1 = require("../model/account/AccountPropertiesInfo");
const Address_1 = require("../model/account/Address");
const MultisigAccountGraphInfo_1 = require("../model/account/MultisigAccountGraphInfo");
const MultisigAccountInfo_1 = require("../model/account/MultisigAccountInfo");
const PublicAccount_1 = require("../model/account/PublicAccount");
const Mosaic_1 = require("../model/mosaic/Mosaic");
const MosaicId_1 = require("../model/mosaic/MosaicId");
const UInt64_1 = require("../model/UInt64");
const Http_1 = require("./Http");
const NetworkHttp_1 = require("./NetworkHttp");
const CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
/**
 * Account http repository.
 *
 * @since 1.0
 */
class AccountHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url, networkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp_1.NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
        this.accountRoutesApi = new js_xpx_catapult_library_1.AccountRoutesApi(this.apiClient);
    }
    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    getAccountInfo(address) {
        return rxjs_1.from(this.accountRoutesApi.getAccountInfo(address.plain())).pipe(operators_1.map((accountInfoDTO) => {
            return new AccountInfo_1.AccountInfo(accountInfoDTO.meta, Address_1.Address.createFromEncoded(accountInfoDTO.account.address), new UInt64_1.UInt64(accountInfoDTO.account.addressHeight), accountInfoDTO.account.publicKey, new UInt64_1.UInt64(accountInfoDTO.account.publicKeyHeight), accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic_1.Mosaic(new MosaicId_1.MosaicId(mosaicDTO.id), new UInt64_1.UInt64(mosaicDTO.amount))));
        }));
    }
    /**
     * Gets Account property.
     * @param publicAccount public account
     * @returns Observable<AccountProperty>
     */
    getAccountProperty(publicAccount) {
        return rxjs_1.from(this.accountRoutesApi.getAccountProperties(publicAccount.publicKey)).pipe(operators_1.map((accountProperties) => {
            return new AccountPropertiesInfo_1.AccountPropertiesInfo(accountProperties.meta, accountProperties.accountProperties);
        }));
    }
    /**
     * Gets Account properties.
     * @param address list of addresses
     * @returns Observable<AccountProperty[]>
     */
    getAccountProperties(addresses) {
        const accountIds = addresses.map((address) => address.plain());
        return rxjs_1.from(this.accountRoutesApi.getAccountPropertiesFromAccounts(accountIds)).pipe(operators_1.map((accountProperties) => {
            return accountProperties.map((property) => {
                return new AccountPropertiesInfo_1.AccountPropertiesInfo(property.meta, property.accountProperties);
            });
        }));
    }
    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    getAccountsInfo(addresses) {
        const accountIdsBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return rxjs_1.from(this.accountRoutesApi.getAccountsInfo(accountIdsBody)).pipe(operators_1.map((accountsInfoMetaDataDTO) => {
            return accountsInfoMetaDataDTO.map((accountInfoDTO) => {
                return new AccountInfo_1.AccountInfo(accountInfoDTO.meta, Address_1.Address.createFromEncoded(accountInfoDTO.account.address), new UInt64_1.UInt64(accountInfoDTO.account.addressHeight), accountInfoDTO.account.publicKey, new UInt64_1.UInt64(accountInfoDTO.account.publicKeyHeight), accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic_1.Mosaic(mosaicDTO.id, mosaicDTO.amount)));
            });
        }));
    }
    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountInfo>
     */
    getMultisigAccountInfo(address) {
        return this.getNetworkTypeObservable().pipe(operators_1.mergeMap((networkType) => rxjs_1.from(this.accountRoutesApi.getAccountMultisig(address.plain())).pipe(operators_1.map((multisigAccountInfoDTO) => {
            return new MultisigAccountInfo_1.MultisigAccountInfo(PublicAccount_1.PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.account, networkType), multisigAccountInfoDTO.multisig.minApproval, multisigAccountInfoDTO.multisig.minRemoval, multisigAccountInfoDTO.multisig.cosignatories
                .map((cosigner) => PublicAccount_1.PublicAccount.createFromPublicKey(cosigner, networkType)), multisigAccountInfoDTO.multisig.multisigAccounts
                .map((multisigAccount) => PublicAccount_1.PublicAccount.createFromPublicKey(multisigAccount, networkType)));
        }))));
    }
    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountGraphInfo>
     */
    getMultisigAccountGraphInfo(address) {
        return this.getNetworkTypeObservable().pipe(operators_1.mergeMap((networkType) => rxjs_1.from(this.accountRoutesApi.getAccountMultisigGraph(address.plain())).pipe(operators_1.map((multisigAccountGraphInfosDTO) => {
            const multisigAccounts = new Map();
            multisigAccountGraphInfosDTO.map((multisigAccountGraphInfoDTO) => {
                multisigAccounts.set(multisigAccountGraphInfoDTO.level, multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
                    return new MultisigAccountInfo_1.MultisigAccountInfo(PublicAccount_1.PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.account, networkType), multisigAccountInfoDTO.multisig.minApproval, multisigAccountInfoDTO.multisig.minRemoval, multisigAccountInfoDTO.multisig.cosignatories
                        .map((cosigner) => PublicAccount_1.PublicAccount.createFromPublicKey(cosigner, networkType)), multisigAccountInfoDTO.multisig.multisigAccounts
                        .map((multisigAccountDTO) => PublicAccount_1.PublicAccount.createFromPublicKey(multisigAccountDTO, networkType)));
                }));
            });
            return new MultisigAccountGraphInfo_1.MultisigAccountGraphInfo(multisigAccounts);
        }))));
    }
    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    transactions(publicAccount, queryParams) {
        return rxjs_1.from(this.accountRoutesApi.transactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    incomingTransactions(publicAccount, queryParams) {
        return rxjs_1.from(this.accountRoutesApi.incomingTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    outgoingTransactions(publicAccount, queryParams) {
        return rxjs_1.from(this.accountRoutesApi.outgoingTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    unconfirmedTransactions(publicAccount, queryParams) {
        return rxjs_1.from(this.accountRoutesApi.unconfirmedTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<AggregateTransaction[]>
     */
    aggregateBondedTransactions(publicAccount, queryParams) {
        return rxjs_1.from(this.accountRoutesApi.partialTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(operators_1.map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }
}
exports.AccountHttp = AccountHttp;
//# sourceMappingURL=AccountHttp.js.map