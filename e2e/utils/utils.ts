import { Listener } from "../../src/infrastructure/Listener";
import { Address, Transaction } from "../../src/model/model";

export const validateTransactionConfirmed = (listener: Listener, address: Address,  hash: string) => {
    return new Promise((resolve, reject) => {
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

    // TODO: improve
    const validatePartialTransactionAnnounceCorrectly = (address: Address, done) => {
        const sub = listener.aggregateBondedAdded(address).subscribe((transaction: Transaction) => {
            sub.unsubscribe();
            return done();
        });
    }

    // TODO: improve
    const validateCosignaturePartialTransactionAnnounceCorrectly = (address: Address, publicKey, done) => {
        const sub = listener.cosignatureAdded(address).subscribe((signature) => {
            if (signature.signer === publicKey) {
                sub.unsubscribe();
                return done();
            }
        });
    }

    // TODO: improve
    const validatePartialTransactionNotPartialAnyMore = (address: Address, hash: string, done) => {
        const sub = listener.aggregateBondedRemoved(address).subscribe(txhash => {
            if (txhash === hash) {
                sub.unsubscribe();
                return done();
            }
        });
    }

}
