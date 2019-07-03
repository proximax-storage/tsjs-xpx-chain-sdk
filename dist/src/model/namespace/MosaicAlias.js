"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The MosaicAlias structure describe mosaic aliases
 *
 * @since 0.10.2
 */
class MosaicAlias {
    /**
     * Create AddressAlias object
     *
     * @param type
     * @param mosaicId
     */
    constructor(/**
                 * The alias type
                 */ type, 
    /**
     * The alias address
     */
    mosaicId) {
        this.type = type;
        this.mosaicId = mosaicId;
    }
    /**
     * Compares AddressAlias for equality.
     *
     * @return boolean
     */
    equals(alias) {
        if (alias instanceof MosaicAlias) {
            return this.mosaicId.equals(alias.mosaicId);
        }
        return false;
    }
    /**
     * Get string value of mosaicId
     * @returns {string}
     */
    toHex() {
        return this.mosaicId.toHex();
    }
}
exports.MosaicAlias = MosaicAlias;
//# sourceMappingURL=MosaicAlias.js.map