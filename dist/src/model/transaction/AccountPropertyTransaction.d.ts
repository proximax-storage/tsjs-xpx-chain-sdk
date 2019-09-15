import { PropertyType } from '../account/PropertyType';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountPropertyModification } from './AccountPropertyModification';
import { Deadline } from './Deadline';
import { ModifyAccountPropertyAddressTransaction } from './ModifyAccountPropertyAddressTransaction';
import { ModifyAccountPropertyEntityTypeTransaction } from './ModifyAccountPropertyEntityTypeTransaction';
import { ModifyAccountPropertyMosaicTransaction } from './ModifyAccountPropertyMosaicTransaction';
import { TransactionType } from './TransactionType';
export declare class AccountPropertyTransaction {
    /**
     * Create an address modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of address modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyAddressTransaction}
     */
    static createAddressPropertyModificationTransaction(deadline: Deadline, propertyType: PropertyType, modifications: Array<AccountPropertyModification<string>>, networkType: NetworkType, maxFee?: UInt64): ModifyAccountPropertyAddressTransaction;
    /**
     * Create an mosaic modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of mosaic modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyMosaicTransaction}
     */
    static createMosaicPropertyModificationTransaction(deadline: Deadline, propertyType: PropertyType, modifications: Array<AccountPropertyModification<number[]>>, networkType: NetworkType, maxFee?: UInt64): ModifyAccountPropertyMosaicTransaction;
    /**
     * Create an entity type modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of entity type modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyEntityTypeTransaction}
     */
    static createEntityTypePropertyModificationTransaction(deadline: Deadline, propertyType: PropertyType, modifications: Array<AccountPropertyModification<TransactionType>>, networkType: NetworkType, maxFee?: UInt64): ModifyAccountPropertyEntityTypeTransaction;
}
