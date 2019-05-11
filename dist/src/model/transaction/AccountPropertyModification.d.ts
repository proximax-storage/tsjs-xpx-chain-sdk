import { Address } from '../account/Address';
import { PropertyModificationType } from '../account/PropertyModificationType';
import { MosaicId } from '../mosaic/MosaicId';
import { TransactionType } from './TransactionType';
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
    /**
     * Create an address filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param address - modification value (Address)
     * @returns {AccountPropertyModification}
     */
    static createForAddress(modificationType: PropertyModificationType, address: Address): AccountPropertyModification<string>;
    /**
     * Create an mosaic filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param mosaicId - modification value (Mosaic)
     * @returns {AccountPropertyModification}
     */
    static createForMosaic(modificationType: PropertyModificationType, mosaicId: MosaicId): AccountPropertyModification<number[]>;
    /**
     * Create an entity type filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param entityType - modification value (Transaction Type)
     * @returns {AccountPropertyModification}
     */
    static createForEntityType(modificationType: PropertyModificationType, entityType: number): AccountPropertyModification<TransactionType>;
    /**
     * @internal
     */
    toDTO(): {
        value: T;
        modificationType: PropertyModificationType;
    };
}
