import { PublicAccount } from '../account/PublicAccount';
import { RestrictionType } from '../account/RestrictionType';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
export declare class AccountMosaicRestrictionModificationTransaction extends Transaction {
    readonly restrictionType: RestrictionType;
    readonly modifications: Array<AccountRestrictionModification<number[]>>;
    /**
     * Create a modify account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - The account restriction type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionModificationTransaction}
     */
    static create(deadline: Deadline, restrictionType: RestrictionType, modifications: Array<AccountRestrictionModification<number[]>>, networkType: NetworkType, maxFee?: UInt64): AccountMosaicRestrictionModificationTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param restrictionType
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, restrictionType: RestrictionType, modifications: Array<AccountRestrictionModification<number[]>>, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountMosaicRestrictionModificationTransaction
     * @returns {number}
     * @memberof AccountMosaicRestrictionModificationTransaction
     */
    readonly size: number;
}
