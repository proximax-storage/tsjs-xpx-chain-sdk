import { Address } from '../account/Address';
import { Alias } from './Alias';
/**
 * The AddressAlias structure describes address aliases
 *
 * @since 0.10.2
 */
export declare class AddressAlias implements Alias {
    readonly type: number;
    /**
     * The alias address
     */
    readonly address: Address;
    /**
     * Create AddressAlias object
     *
     * @param type
     * @param content
     */
    constructor(/**
                 * The alias type
                 */ type: number, 
    /**
     * The alias address
     */
    address: Address);
    /**
     * Compares AddressAlias for equality.
     *
     * @return boolean
     */
    equals(alias: any): boolean;
}
