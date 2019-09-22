import { TransactionHttp, BlockHttp, ChainHttp } from "../infrastructure/infrastructure";
export declare class HttpApiEndpoint {
    readonly url: string;
    private _block;
    private _chain;
    private _transactions;
    constructor(url: string);
    /**
     * transactions http api getter
     */
    readonly transactions: TransactionHttp;
    readonly block: BlockHttp;
    readonly chain: ChainHttp;
}
