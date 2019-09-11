import { Observable } from 'rxjs';
import { PublicAccount } from '../model/account/PublicAccount';
import { Http } from './Http';
import { Address, Contract } from '../model/model';
import { ContractRepository } from './ContractRepository';
import { NetworkHttp } from './NetworkHttp';
/**
 * Contract http repository.
 *
 * @since 0.1.0
 */
export declare class ContractHttp extends Http implements ContractRepository {
    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp);
    getAccountContract(publicAccount: PublicAccount): Observable<Contract[]>;
    getAccountsContracts(publicAccounts?: PublicAccount[]): Observable<Contract[]>;
    getContract(address: Address): Observable<Contract>;
    getContracts(addresses: Address[]): Observable<Contract[]>;
}
