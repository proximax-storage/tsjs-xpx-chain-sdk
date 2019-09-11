import { Listener } from "../../src/infrastructure/Listener";
import { Address, AggregateTransaction } from "../../src/model/model";
export declare const validateTransactionConfirmed: (listener: Listener, address: Address, hash: string) => Promise<unknown>;
export declare const validatePartialTransactionAnnouncedCorrectly: (listener: Listener, address: Address, hash: string, done: (tx: AggregateTransaction) => void) => void;
export declare const validateCosignaturePartialTransactionAnnouncedCorrectly: (listener: Listener, address: Address, publicKey: any, done: any) => void;
export declare const validatePartialTransactionNotPartialAnyMore: (listener: Listener, address: Address, hash: string, done: any) => void;
