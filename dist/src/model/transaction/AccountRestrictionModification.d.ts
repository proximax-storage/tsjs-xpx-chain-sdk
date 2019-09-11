import { Address } from '../account/Address';
import { RestrictionModificationType } from '../account/RestrictionModificationType';
import { MosaicId } from '../mosaic/MosaicId';
import { TransactionType } from './TransactionType';
export declare class AccountRestrictionModification<T> {
    /**
     * Modification type.
     */
    readonly modificationType: RestrictionModificationType;
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
    modificationType: RestrictionModificationType, 
    /**
     * Modification value (Address, Mosaic or Transaction Type).
     */
    value: T);
    /**
     * Create an address filter for account restriction modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param address - modification value (Address)
     * @returns {AccountRestrictionModification}
     */
    static createForAddress(modificationType: RestrictionModificationType, address: Address): AccountRestrictionModification<string>;
    /**
     * Create an mosaic filter for account restriction modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param mosaicId - modification value (Mosaic)
     * @returns {AccountRestrictionModification}
     */
    static createForMosaic(modificationType: RestrictionModificationType, mosaicId: MosaicId): AccountRestrictionModification<number[]>;
    /**
     * Create an operation filter for account restriction modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param operation - modification value (Transaction Type)
     * @returns {AccountRestrictionModification}
     */
    static createForOperation(modificationType: RestrictionModificationType, operation: number): AccountRestrictionModification<TransactionType>;
}
