import { RestrictionType } from './RestrictionType';
/**
 * Account restriction structure describes restriction information.
 */
export declare class AccountRestriction {
    /**
     * Account restriction type
     */
    readonly restrictionType: RestrictionType;
    /**
     * Restriction values.
     */
    readonly values: object[];
    /**
     * Constructor
     * @param restrictionType
     * @param values
     */
    constructor(
    /**
     * Account restriction type
     */
    restrictionType: RestrictionType, 
    /**
     * Restriction values.
     */
    values: object[]);
}
