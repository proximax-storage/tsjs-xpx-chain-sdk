import { AccountProperty } from './AccountProperty';
import { Address } from './Address';
/**
 * Account properties structure describes property information for an account.
 */
export declare class AccountProperties {
    /**
     * Account Address
     */
    readonly address: Address;
    /**
     * Properties.
     */
    readonly properties: AccountProperty[];
    /**
     * Constructor
     * @param address
     * @param properties
     */
    constructor(
    /**
     * Account Address
     */
    address: Address, 
    /**
     * Properties.
     */
    properties: AccountProperty[]);
}
