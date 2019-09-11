"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransactionConfirmed = (listener, address, hash) => {
    return new Promise((resolve, reject) => {
        const status = listener.status(address).subscribe(error => {
            if (error && hash && error.hash === hash) {
                console.error(error);
                status.unsubscribe();
                sub.unsubscribe();
                reject(error);
            }
        });
        const sub = listener.confirmed(address).subscribe((transaction) => {
            if (transaction && transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
                // console.log(transaction);
                status.unsubscribe();
                sub.unsubscribe();
                resolve();
            }
        });
    });
};
// TODO: improve
exports.validatePartialTransactionAnnouncedCorrectly = (listener, address, hash, done) => {
    const sub = listener.aggregateBondedAdded(address).subscribe((transaction) => {
        if (transaction && transaction.transactionInfo && transaction.transactionInfo.hash === hash) {
            sub.unsubscribe();
            return done(transaction);
        }
    });
};
// TODO: improve
exports.validateCosignaturePartialTransactionAnnouncedCorrectly = (listener, address, publicKey, done) => {
    const sub = listener.cosignatureAdded(address).subscribe((signature) => {
        if (signature.signer === publicKey) {
            sub.unsubscribe();
            return done();
        }
    });
};
// TODO: improve
exports.validatePartialTransactionNotPartialAnyMore = (listener, address, hash, done) => {
    const sub = listener.aggregateBondedRemoved(address).subscribe(txhash => {
        if (txhash === hash) {
            sub.unsubscribe();
            return done();
        }
    });
};
//# sourceMappingURL=utils.js.map