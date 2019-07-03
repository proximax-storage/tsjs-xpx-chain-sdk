import { ResolutionStatement } from './ResolutionStatement';
import { TransactionStatement } from './TransactionStatement';
export declare class Statement {
    /**
     * The transaction statements.
     */
    readonly transactionStatements: TransactionStatement[];
    /**
     * The address resolution statements.
     */
    readonly addressResolutionStatements: ResolutionStatement[];
    /**
     * The mosaic resolution statements.
     */
    readonly mosaicResolutionStatements: ResolutionStatement[];
    /**
     * Receipt - transaction statement object
     * @param transactionStatements - The transaction statements.
     * @param addressResolutionStatements - The address resolution statements.
     * @param mosaicResolutionStatements - The mosaic resolution statements.
     */
    constructor(
    /**
     * The transaction statements.
     */
    transactionStatements: TransactionStatement[], 
    /**
     * The address resolution statements.
     */
    addressResolutionStatements: ResolutionStatement[], 
    /**
     * The mosaic resolution statements.
     */
    mosaicResolutionStatements: ResolutionStatement[]);
}
