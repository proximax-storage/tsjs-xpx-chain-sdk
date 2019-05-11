import { VerifiableTransaction } from 'js-xpx-catapult-library';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { MultisigCosignatoryModification } from './MultisigCosignatoryModification';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
/**
 * Modify multisig account transactions are part of the NEM's multisig account system.
 * A modify multisig account transaction holds an array of multisig cosignatory modifications,
 * min number of signatures to approve a transaction and a min number of signatures to remove a cosignatory.
 * @since 1.0
 */
export declare class ModifyMultisigAccountTransaction extends Transaction {
    /**
     * The number of signatures needed to approve a transaction.
     * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
     */
    readonly minApprovalDelta: number;
    /**
     * The number of signatures needed to remove a cosignatory.
     * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
     */
    readonly minRemovalDelta: number;
    /**
     * The array of cosigner accounts added or removed from the multi-signature account.
     */
    readonly modifications: MultisigCosignatoryModification[];
    /**
     * Create a modify multisig account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param minApprovalDelta - The min approval relative change.
     * @param minRemovalDelta - The min removal relative change.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyMultisigAccountTransaction}
     */
    static create(deadline: Deadline, minApprovalDelta: number, minRemovalDelta: number, modifications: MultisigCosignatoryModification[], networkType: NetworkType, maxFee?: UInt64): ModifyMultisigAccountTransaction;
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
    constructor(networkType: NetworkType, version: number, deadline: Deadline, maxFee: UInt64, 
    /**
     * The number of signatures needed to approve a transaction.
     * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
     */
    minApprovalDelta: number, 
    /**
     * The number of signatures needed to remove a cosignatory.
     * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
     */
    minRemovalDelta: number, 
    /**
     * The array of cosigner accounts added or removed from the multi-signature account.
     */
    modifications: MultisigCosignatoryModification[], signature?: string, signer?: PublicAccount, transactionInfo?: TransactionInfo);
    /**
     * @override Transaction.size()
     * @description get the byte size of a ModifyMultisigAccountTransaction
     * @returns {number}
     * @memberof ModifyMultisigAccountTransaction
     */
    readonly size: number;
    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction;
}
