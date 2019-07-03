/**
 * The blockchain storage info structure describes stored data.
 */
export declare class BlockchainStorageInfo {
    readonly numBlocks: number;
    /**
     * The number of confirmed transactions.
     */
    readonly numTransactions: number;
    /**
     * The number accounts published in the blockchain.
     */
    readonly numAccounts: number;
    /**
     * @param numBlocks
     * @param numTransactions
     * @param numAccounts
     */
    constructor(/**
                 * The number of confirmed blocks.
                 */ numBlocks: number, 
    /**
     * The number of confirmed transactions.
     */
    numTransactions: number, 
    /**
     * The number accounts published in the blockchain.
     */
    numAccounts: number);
}
