import { Listener } from "../../src/infrastructure/Listener";
import { Address, Transaction, AggregateTransactionInfo, AggregateTransaction } from "../../src/model/model";

export const validateTransactionConfirmed = (listener: Listener, address: Address,  hash: string) => {
    return new Promise<void>((resolve, reject) => {
        const status = listener.status(address).subscribe(error => {
            if (error && hash && error.hash === hash) {
                console.error(error);
                status.unsubscribe();
                sub.unsubscribe();
                reject(error);
            }
        });
        const sub = listener.confirmed(address).subscribe((transaction: Transaction) => {
            if (transaction && transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
                // console.log(transaction);
                status.unsubscribe();
                sub.unsubscribe();
                resolve();
            }
        });
    });
}

// TODO: improve
export const validatePartialTransactionAnnouncedCorrectly = (listener: Listener, address: Address, hash: string, done: (tx: AggregateTransaction) => void) => {
    const sub = listener.aggregateBondedAdded(address).subscribe((transaction: Transaction) => {
        if (transaction && transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
            sub.unsubscribe();
            return done(transaction as AggregateTransaction);
        }
    });
}

// TODO: improve
export const validateCosignaturePartialTransactionAnnouncedCorrectly = (listener: Listener, address: Address, publicKey, done) => {
    const sub = listener.cosignatureAdded(address).subscribe((signature) => {
        if (signature.signer === publicKey) {
            sub.unsubscribe();
            return done();
        }
    });
}

// TODO: improve
export const validatePartialTransactionNotPartialAnyMore = (listener: Listener, address: Address, hash: string, done) => {
    const sub = listener.aggregateBondedRemoved(address).subscribe(txhash => {
        if (txhash === hash) {
            sub.unsubscribe();
            return done();
        }
    });
}
