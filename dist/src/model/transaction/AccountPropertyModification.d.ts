import { PropertyModificationType } from '../account/PropertyModificationType';
export declare class AccountPropertyModification<T> {
    /**
     * Modification type.
     */
    readonly modificationType: PropertyModificationType;
    /**
     * Modification value (Address, Mosaic or Transaction Type).
     */
    readonly value: T;
    /**
     * Constructor
     * @param modificationType
     * @param value
     */
    constructor(
    /**
     * Modification type.
     */
    modificationType: PropertyModificationType, 
    /**
     * Modification value (Address, Mosaic or Transaction Type).
     */
    value: T);
}
