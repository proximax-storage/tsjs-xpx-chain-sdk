import { AccountRestriction } from './AccountRestriction';
import { Address } from './Address';
/**
 * Account restrictions structure describes restriction information for an account.
 */
export declare class AccountRestrictions {
    /**
     * Account Address
     */
    readonly address: Address;
    /**
     * Restrictions.
     */
    readonly restrictions: AccountRestriction[];
    /**
     * Constructor
     * @param address
     * @param restrictions
     */
    constructor(
    /**
     * Account Address
     */
    address: Address, 
    /**
     * Restrictions.
     */
    restrictions: AccountRestriction[]);
}
