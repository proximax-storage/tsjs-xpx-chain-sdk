import { Receipt } from '../../model/receipt/Receipt';
import { Statement } from '../../model/receipt/Statement';
/**
 * @param receiptDTO
 * @param networkType
 * @returns {Statement}
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.h
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.cpp
 * @constructor
 */
export declare const CreateStatementFromDTO: (receiptDTO: any, networkType: any) => Statement;
/**
 * @param receiptDTO
 * @param networkType
 * @returns {Receipt}
 * @constructor
 */
export declare const CreateReceiptFromDTO: (receiptDTO: any, networkType: any) => Receipt;
