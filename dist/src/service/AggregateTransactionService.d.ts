import { Observable } from 'rxjs';
import { AccountHttp } from '../infrastructure/AccountHttp';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
/**
 * Aggregated Transaction service
 */
export declare class AggregateTransactionService {
    private readonly accountHttp;
    /**
     * Constructor
     * @param accountHttp
     */
    constructor(accountHttp: AccountHttp);
    /**
     * Check if an aggregate complete transaction has all cosignatories attached
     * @param signedTransaction - The signed aggregate transaction (complete) to be verified
     * @returns {Observable<boolean>}
     */
    isComplete(signedTransaction: SignedTransaction): Observable<boolean>;
    /**
     * Validate cosignatories against multisig Account(s)
     * @param graphInfo - multisig account graph info
     * @param cosignatories - array of cosignatories extracted from aggregated transaction
     * @param innerTransaction - the inner transaction of the aggregated transaction
     * @returns {boolean}
     */
    private validateCosignatories;
    /**
     * Compare two string arrays
     * @param array1 - base array
     * @param array2 - array to be matched
     * @returns {string[]} - array of matched elements
     */
    private compareArrays;
}
