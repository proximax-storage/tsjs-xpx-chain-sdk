import { MultisigAccountInfo } from './MultisigAccountInfo';
/**
 * Multisig account graph info model
 */
export declare class MultisigAccountGraphInfo {
    readonly multisigAccounts: Map<number, MultisigAccountInfo[]>;
    /**
     * @internal
     * @param multisigAccounts
     */
    constructor(/**
                 * The multisig accounts.
                 */ multisigAccounts: Map<number, MultisigAccountInfo[]>);
}
