import { RestrictionType } from '../account/RestrictionType';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountAddressRestrictionModificationTransaction } from './AccountAddressRestrictionModificationTransaction';
import { AccountMosaicRestrictionModificationTransaction } from './AccountMosaicRestrictionModificationTransaction';
import { AccountOperationRestrictionModificationTransaction } from './AccountOperationRestrictionModificationTransaction';
import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from './Deadline';
import { TransactionType } from './TransactionType';
export declare class AccountRestrictionTransaction {
    /**
     * Create an account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of address modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionModificationTransaction}
     */
    static createAddressRestrictionModificationTransaction(deadline: Deadline, restrictionType: RestrictionType, modifications: Array<AccountRestrictionModification<string>>, networkType: NetworkType, maxFee?: UInt64): AccountAddressRestrictionModificationTransaction;
    /**
     * Create an account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of mosaic modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountMosaicRestrictionModificationTransaction}
     */
    static createMosaicRestrictionModificationTransaction(deadline: Deadline, restrictionType: RestrictionType, modifications: Array<AccountRestrictionModification<number[]>>, networkType: NetworkType, maxFee?: UInt64): AccountMosaicRestrictionModificationTransaction;
    /**
     * Create an account operation restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of operation modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {createOperationRestrictionModificationTransaction}
     */
    static createOperationRestrictionModificationTransaction(deadline: Deadline, restrictionType: RestrictionType, modifications: Array<AccountRestrictionModification<TransactionType>>, networkType: NetworkType, maxFee?: UInt64): AccountOperationRestrictionModificationTransaction;
}
