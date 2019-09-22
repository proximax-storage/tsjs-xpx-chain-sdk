"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infrastructure_1 = require("../infrastructure/infrastructure");
class HttpApiEndpoint {
    constructor(url) {
        this.url = url;
    }
    /**
     * transactions http api getter
     */
    get transactions() {
        if (!this._transactions) {
            this._transactions = new infrastructure_1.TransactionHttp(this.url);
        }
        return this._transactions;
    }
    get block() {
        if (!this._block) {
            this._block = new infrastructure_1.BlockHttp(this.url);
        }
        return this._block;
    }
    get chain() {
        if (!this._chain) {
            this._chain = new infrastructure_1.ChainHttp(this.url);
        }
        return this._chain;
    }
}
exports.HttpApiEndpoint = HttpApiEndpoint;
//# sourceMappingURL=HttpApiEndpoint.js.map