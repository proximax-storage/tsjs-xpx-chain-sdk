import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicSupplyType } from '../mosaic/MosaicSupplyType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
/**
 * In case a mosaic has the flag 'supplyMutable' set to true, the creator of the mosaic can change the supply,
 * i.e. increase or decrease the supply.
 */
export declare class MosaicSupplyChangeTransaction extends Transaction {
    /**
     * The mosaic id.
     */
    readonly mosaicId: MosaicId;
    /**
     * The supply type.
     */
    readonly direction: MosaicSupplyType;
    /**
     * The supply change in units for the mosaic.
     */
    readonly delta: UInt64;
    /**
     * Create a mosaic supply change transaction object
     * @param deadline - The deadline to include the transaction.
     * @param mosaicId - The mosaic id.
     * @param direction - The supply type.
     * @param delta - The supply change in units for the mosaic.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicSupplyChangeTransaction}
     */
    static create(deadline: Deadline, mosaicId: MosaicId, direction: MosaicSupplyType, delta: UInt64, networkType: NetworkType, maxFee?: UInt64): MosaicSupplyChangeTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicId
     * @param direction
     * @param delta
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The mosaic id.
     */
    mosaicId: MosaicId, 
    /**
     * The supply type.
     */
    direction: MosaicSupplyType, 
    /**
     * The supply change in units for the mosaic.
     */
    delta: UInt64, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicSupplyChangeTransaction
     * @returns {number}
     * @memberof MosaicSupplyChangeTransaction
     */
    readonly size: number;
    static calculateSize(): number;
}
export declare class MosaicSupplyChangeTransactionBuilder extends TransactionBuilder {
    private _mosaicId;
    private _direction;
    private _delta;
    mosaicId(mosaicId: MosaicId): this;
    direction(direction: MosaicSupplyType): this;
    delta(delta: UInt64): this;
    build(): MosaicSupplyChangeTransaction;
}
