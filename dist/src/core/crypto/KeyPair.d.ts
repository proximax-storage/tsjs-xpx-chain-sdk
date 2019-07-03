export declare class KeyPair {
    /**
     * Creates a key pair from a private key string.
     * @param {string} privateKeyString A hex encoded private key string.
     * @returns {module:crypto/keyPair~KeyPair} The key pair.
     */
    static createKeyPairFromPrivateKeyString: (privateKeyString: any) => {
        privateKey: Uint8Array;
        publicKey: Uint8Array;
    };
    /**
     * Signs a data buffer with a key pair.
     * @param {module:crypto/keyPair~KeyPair} keyPair The key pair to use for signing.
     * @param {Uint8Array} data The data to sign.
     * @returns {Uint8Array} The signature.
     */
    static sign: (keyPair: any, data: any) => Uint8Array;
    /**
     * Verifies a signature.
     * @param {module:crypto/keyPair~PublicKey} publicKey The public key to use for verification.
     * @param {Uint8Array} data The data to verify.
     * @param {Uint8Array} signature The signature to verify.
     * @returns {boolean} true if the signature is verifiable, false otherwise.
     */
    static verify: (publicKey: any, data: any, signature: any) => boolean;
    /**
     * Creates a shared key given a key pair and an arbitrary public key.
     * The shared key can be used for encrypted message passing between the two.
     * @param {module:crypto/keyPair~KeyPair} keyPair The key pair for which to create the shared key.
     * @param {module:crypto/keyPair~PublicKey} publicKey The public key for which to create the shared key.
     * @param {Uint8Array} salt A salt that should be applied to the shared key.
     * @returns {Uint8Array} The shared key.
     */
    static deriveSharedKey: (keyPair: any, publicKey: any, salt: any) => Uint8Array;
}
