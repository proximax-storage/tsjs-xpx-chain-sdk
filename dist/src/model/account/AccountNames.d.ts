import { NamespaceName } from '../namespace/NamespaceName';
import { Address } from './Address';
/**
 * Account with linked names
 */
export declare class AccountNames {
    /**
     * Address of the account.
     */
    readonly address: Address;
    /**
     * Address linked namespace Ids
     */
    readonly names: NamespaceName[];
    /**
     *
     */
    constructor(
    /**
     * Address of the account.
     */
    address: Address, 
    /**
     * Address linked namespace Ids
     */
    names: NamespaceName[]);
}
