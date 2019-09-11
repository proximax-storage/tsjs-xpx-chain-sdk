"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Account restrictions structure describes restriction information for an account.
 */
class AccountRestrictions {
    /**
     * Constructor
     * @param address
     * @param restrictions
     */
    constructor(
    /**
     * Account Address
     */
    address, 
    /**
     * Restrictions.
     */
    restrictions) {
        this.address = address;
        this.restrictions = restrictions;
    }
}
exports.AccountRestrictions = AccountRestrictions;
//# sourceMappingURL=AccountRestrictions.js.map