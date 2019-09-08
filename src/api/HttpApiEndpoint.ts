import { TransactionHttp, BlockHttp, ChainHttp } from "../infrastructure/infrastructure";

export class HttpApiEndpoint {
    private _block: BlockHttp;
    private _chain: ChainHttp;
    private _transactions: TransactionHttp;

    constructor(
        public readonly url: string
    ) {

    }

    /**
     * transactions http api getter
     */
    public get transactions() {
        if (! this._transactions) {
            this._transactions = new TransactionHttp(this.url);
        }
        return this._transactions;
    }

    public get block() {
        if (! this._block) {
            this._block = new BlockHttp(this.url);
        }
        return this._block;
    }

    public get chain() {
        if (! this._chain) {
            this._chain = new ChainHttp(this.url);
        }
        return this._chain;
    }

}