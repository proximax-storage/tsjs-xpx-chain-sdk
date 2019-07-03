import { PublicAccount } from './PublicAccount';
/**
 * The multisig account graph info structure describes the information of all the mutlisig levels an account is involved in.
 */
export declare class MultisigAccountInfo {
    readonly account: PublicAccount;
    /**
     * The number of signatures needed to approve a transaction.
     */
    readonly minApproval: number;
    /**
     * The number of signatures needed to remove a cosignatory.
     */
    readonly minRemoval: number;
    /**
     * The multisig account cosignatories.
     */
    readonly cosignatories: PublicAccount[];
    /**
     * The multisig accounts this account is cosigner of.
     */
    readonly multisigAccounts: PublicAccount[];
    /**
     * @param account
     * @param minApproval
     * @param minRemoval
     * @param cosignatories
     * @param multisigAccounts
     */
    constructor(/**
                 * The account multisig public account.
                 */ account: PublicAccount, 
    /**
     * The number of signatures needed to approve a transaction.
     */
    minApproval: number, 
    /**
     * The number of signatures needed to remove a cosignatory.
     */
    minRemoval: number, 
    /**
     * The multisig account cosignatories.
     */
    cosignatories: PublicAccount[], 
    /**
     * The multisig accounts this account is cosigner of.
     */
    multisigAccounts: PublicAccount[]);
    /**
     * Checks if the account is a multisig account.
     * @returns {boolean}
     */
    isMultisig(): boolean;
    /**
     * Checks if an account is cosignatory of the multisig account.
     * @param account
     * @returns {boolean}
     */
    hasCosigner(account: PublicAccount): boolean;
    /**
     * Checks if the multisig account is cosignatory of an account.
     * @param account
     * @returns {boolean}
     */
    isCosignerOfMultisigAccount(account: PublicAccount): boolean;
}
