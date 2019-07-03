import { PropertyType } from './PropertyType';
/**
 * Account property structure describes property information.
 */
export declare class AccountProperty {
    /**
     * Account property type
     */
    readonly propertyType: PropertyType;
    /**
     * Property values.
     */
    readonly values: object[];
    /**
     * Constructor
     * @param propertyType
     * @param values
     */
    constructor(
    /**
     * Account property type
     */
    propertyType: PropertyType, 
    /**
     * Property values.
     */
    values: object[]);
}
