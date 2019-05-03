"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The AddressAlias structure describes address aliases
 *
 * @since 0.10.2
 */
class AddressAlias {
    /**
     * Create AddressAlias object
     *
     * @param type
     * @param content
     */
    constructor(/**
                 * The alias type
                 */ type, 
    /**
     * The alias address
     */
    address) {
        this.type = type;
        this.address = address;
    }
    /**
     * Compares AddressAlias for equality.
     *
     * @return boolean
     */
    equals(alias) {
        if (alias instanceof AddressAlias) {
            return this.address.equals(alias.address);
        }
        return false;
    }
}
exports.AddressAlias = AddressAlias;
//# sourceMappingURL=AddressAlias.js.map