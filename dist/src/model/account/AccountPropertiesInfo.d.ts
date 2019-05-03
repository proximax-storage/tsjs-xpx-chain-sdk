import { AccountProperties } from './AccountProperties';
/**
 * Account properties structure describes property information for an account.
 */
export declare class AccountPropertiesInfo {
    /**
     * meta
     */
    readonly meta: any;
    /**
     * Properties.
     */
    readonly accountProperties: AccountProperties[];
    /**
     * Constructor
     * @param meta
     * @param accountProperties
     */
    constructor(
    /**
     * meta
     */
    meta: any, 
    /**
     * Properties.
     */
    accountProperties: AccountProperties[]);
}
