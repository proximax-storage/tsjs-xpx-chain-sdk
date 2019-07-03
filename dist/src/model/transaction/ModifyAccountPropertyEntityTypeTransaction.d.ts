import { PropertyType } from '../account/PropertyType';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountPropertyModification } from './AccountPropertyModification';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
export declare class ModifyAccountPropertyEntityTypeTransaction extends Transaction {
    readonly propertyType: PropertyType;
    readonly modifications: Array<AccountPropertyModification<TransactionType>>;
    /**
     * Create a modify account property entity type transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - The account property type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyEntityTypeTransaction}
     */
    static create(deadline: Deadline, propertyType: PropertyType, modifications: Array<AccountPropertyModification<TransactionType>>, networkType: NetworkType, maxFee?: UInt64): ModifyAccountPropertyEntityTypeTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param minApprovalDelta
     * @param minRemovalDelta
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, propertyType: PropertyType, modifications: Array<AccountPropertyModification<TransactionType>>, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a ModifyAccountPropertyEntityTypeTransaction
     * @returns {number}
     * @memberof ModifyAccountPropertyEntityTypeTransaction
     */
    readonly size: number;
}
