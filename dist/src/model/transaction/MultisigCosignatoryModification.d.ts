import { PublicAccount } from '../account/PublicAccount';
import { MultisigCosignatoryModificationType } from './MultisigCosignatoryModificationType';
/**
 * Multisig cosignatory modifications are part of the NEM's multisig account system.
 * With a multisig cosignatory modification a cosignatory is added to or deleted from a multisig account.
 * Multisig cosignatory modifications are part of a modify multisig account transactions.
 *
 */
export declare class MultisigCosignatoryModification {
    /**
     * Multi-signature modification type.
     */
    readonly type: MultisigCosignatoryModificationType;
    /**
     * Cosignatory public account.
     */
    readonly cosignatoryPublicAccount: PublicAccount;
    /**
     * Constructor
     * @param type
     * @param cosignatoryPublicAccount
     */
    constructor(
    /**
     * Multi-signature modification type.
     */
    type: MultisigCosignatoryModificationType, 
    /**
     * Cosignatory public account.
     */
    cosignatoryPublicAccount: PublicAccount);
}
