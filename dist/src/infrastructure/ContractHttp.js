"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const model_1 = require("../model/model");
const contractRoutesApi_1 = require("./api/contractRoutesApi");
const Http_1 = require("./Http");
const NetworkHttp_1 = require("./NetworkHttp");
/**
 * Contract http repository.
 *
 * @since 0.1.0
 */
class ContractHttp extends Http_1.Http {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url, networkHttp, auth, headers) {
        networkHttp = networkHttp == null ? new NetworkHttp_1.NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.contractRoutesApi = new contractRoutesApi_1.ContractRoutesApi(url);
        if (auth) {
            this.contractRoutesApi.setDefaultAuthentication(auth);
        }
        if (headers) {
            this.contractRoutesApi.setHeaders(headers);
        }
    }
    getAccountContract(publicAccount) {
        return rxjs_1.from(this.contractRoutesApi.getAccountContract(publicAccount.publicKey)).pipe(operators_1.map((contractInfoDTOs) => {
            return contractInfoDTOs.map(contractInfoDTO => model_1.Contract.createFromDTO(contractInfoDTO.contract));
        }));
    }
    getAccountsContracts(publicAccounts) {
        return rxjs_1.from(this.contractRoutesApi.getAccountContracts(publicAccounts ? { "publicKeys": publicAccounts.map(publicAccount => publicAccount.publicKey) } : undefined)).pipe(operators_1.map((contractInfoDTOs) => {
            return contractInfoDTOs.map(contractInfoDTO => model_1.Contract.createFromDTO(contractInfoDTO.contract));
        }));
    }
    getContract(address) {
        return rxjs_1.from(this.contractRoutesApi.getContract(address.plain())).pipe(operators_1.map((contractInfoDTO) => {
            return model_1.Contract.createFromDTO(contractInfoDTO.contract);
        }));
    }
    getContracts(addresses) {
        return rxjs_1.from(this.contractRoutesApi.getContracts({ "addresses": addresses.map(address => address.plain()) })).pipe(operators_1.map((contractInfoDTOs) => {
            return contractInfoDTOs.map(contractInfoDTO => model_1.Contract.createFromDTO(contractInfoDTO.contract));
        }));
    }
}
exports.ContractHttp = ContractHttp;
//# sourceMappingURL=ContractHttp.js.map