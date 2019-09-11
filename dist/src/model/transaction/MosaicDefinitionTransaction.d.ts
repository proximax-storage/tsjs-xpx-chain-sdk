import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicNonce } from '../mosaic/MosaicNonce';
import { MosaicProperties } from '../mosaic/MosaicProperties';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
/**
 * Before a mosaic can be created or transferred, a corresponding definition of the mosaic has to be created and published to the network.
 * This is done via a mosaic definition transaction.
 */
export declare class MosaicDefinitionTransaction extends Transaction {
    /**
     * The mosaic nonce.
     */
    readonly nonce: MosaicNonce;
    /**
     * The mosaic id.
     */
    readonly mosaicId: MosaicId;
    /**
     * The mosaic properties.
     */
    readonly mosaicProperties: MosaicProperties;
    /**
     * Create a mosaic creation transaction object
     * @param deadline - The deadline to include the transaction.
     * @param nonce - The mosaic nonce ex: MosaicNonce.createRandom().
     * @param mosaicId - The mosaic id ex: new MosaicId([481110499, 231112638]).
     * @param mosaicProperties - The mosaic properties.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicDefinitionTransaction}
     */
    static create(deadline: Deadline, nonce: MosaicNonce, mosaicId: MosaicId, mosaicProperties: MosaicProperties, networkType: NetworkType, maxFee?: UInt64): MosaicDefinitionTransaction;
    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicNonce
     * @param mosaicId
     * @param mosaicProperties
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The mosaic nonce.
     */
    nonce: MosaicNonce, 
    /**
     * The mosaic id.
     */
    mosaicId: MosaicId, 
    /**
     * The mosaic properties.
     */
    mosaicProperties: MosaicProperties, signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicDefinitionTransaction
     * @returns {number}
     * @memberof MosaicDefinitionTransaction
     */
    readonly size: number;
}
