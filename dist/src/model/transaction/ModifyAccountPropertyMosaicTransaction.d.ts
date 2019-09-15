import { PropertyType } from '../account/PropertyType';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountPropertyModification } from './AccountPropertyModification';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
export declare class ModifyAccountPropertyMosaicTransaction extends Transaction {
    readonly propertyType: PropertyType;
    readonly modifications: Array<AccountPropertyModification<number[]>>;
    /**
     * Create a modify account property mosaic transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - The account property type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyAddressTransaction}
     */
    static create(deadline: Deadline, propertyType: PropertyType, modifications: Array<AccountPropertyModification<number[]>>, networkType: NetworkType, maxFee?: UInt64): ModifyAccountPropertyMosaicTransaction;
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
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, propertyType: PropertyType, modifications: Array<AccountPropertyModification<number[]>>, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a ModifyAccountPropertyMosaicTransaction
     * @returns {number}
     * @memberof ModifyAccountPropertyMosaicTransaction
     */
    readonly size: number;
}
