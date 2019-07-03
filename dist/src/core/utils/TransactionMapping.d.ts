import { Transaction } from '../../model/transaction/Transaction';
export declare class TransactionMapping {
    /**
     * Create transaction class from Json.
     * @param {object} dataJson The transaction json object.
     * @returns {module: model/transaction/transaction} The transaction class.
     */
    static createFromDTO(dataJson: object): Transaction;
    /**
     * Create transaction class from payload binary.
     * @param {string} dataBytes The transaction json object.
     * @returns {module: model/transaction/transaction} The transaction class.
     */
    static createFromPayload(dataBytes: string): Transaction;
}
