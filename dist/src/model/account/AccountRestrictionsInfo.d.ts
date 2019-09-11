import { AccountRestrictions } from './AccountRestrictions';
/**
 * Account restrictions structure describes restriction information for an account.
 */
export declare class AccountRestrictionsInfo {
    /**
     * meta
     */
    readonly meta: any;
    /**
     * Restrictions.
     */
    readonly accountRestrictions: AccountRestrictions;
    /**
     * Constructor
     * @param meta
     * @param accountRestrictions
     */
    constructor(
    /**
     * meta
     */
    meta: any, 
    /**
     * Restrictions.
     */
    accountRestrictions: AccountRestrictions);
}
