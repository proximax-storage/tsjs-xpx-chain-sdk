import { SignSchema } from './SignSchema';
export declare class Crypto {
    /**
     * Encrypt a private key for mobile apps (AES_PBKF2)
     *
     * @param {string} password - A wallet password
     * @param {string} privateKey - An account private key
     *
     * @return {object} - The encrypted data
     */
    static toMobileKey: (password: any, privateKey: any) => {
        encrypted: string;
        salt: any;
    };
    /**
     * Derive a private key from a password using count iterations of SHA3-256
     *
     * @param {string} password - A wallet password
     * @param {number} count - A number of iterations above 0
     *
     * @return {object} - The derived private key
     */
    static derivePassSha: (password: any, count: any) => {
        priv: any;
    };
    /**
     * Encrypt hex data using a key
     *
     * @param {string} data - An hex string
     * @param {Uint8Array} key - An Uint8Array key
     *
     * @return {object} - The encrypted data
     */
    static encrypt: (data: any, key: any) => {
        ciphertext: any;
        iv: any;
        key: any;
    };
    /**
     * Decrypt data
     *
     * @param {object} data - An encrypted data object
     *
     * @return {string} - The decrypted hex string
     */
    static decrypt: (data: any) => any;
    /**
     * Reveal the private key of an account or derive it from the wallet password
     *
     * @param {object} common- An object containing password and privateKey field
     * @param {object} walletAccount - A wallet account object
     * @param {WalletAlgorithm} algo - A wallet algorithm
     *
     * @return {object|boolean} - The account private key in and object or false
     */
    static passwordToPrivateKey: (common: any, walletAccount: any, algo: any) => boolean;
    /**
     * Generate a random key
     *
     * @return {Uint8Array} - A random key
     */
    static randomKey: () => any;
    /**
     * Encode a private key using a password
     *
     * @param {string} privateKey - An hex private key
     * @param {string} password - A password
     *
     * @return {object} - The encoded data
     */
    static encodePrivateKey: (privateKey: any, password: any) => {
        ciphertext: any;
        iv: string;
    };
    /***
     * Encode a message, separated from encode() to help testing
     *
     * @param {string} senderPriv - A sender private key
     * @param {string} recipientPub - A recipient public key
     * @param {string} msg - A text message
     * @param {Uint8Array} iv - An initialization vector
     * @param {Uint8Array} salt - A salt
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {string} - The encoded message
     */
    static _encode: (senderPriv: any, recipientPub: any, msg: any, iv: any, salt: any, signSchema?: SignSchema) => string;
    /**
     * Encode a message
     *
     * @param {string} senderPriv - A sender private key
     * @param {string} recipientPub - A recipient public key
     * @param {string} msg - A text message
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {string} - The encoded message
     */
    static encode: (senderPriv: any, recipientPub: any, msg: any, signSchema?: SignSchema) => string;
    /**
     * Decode an encrypted message payload
     *
     * @param {string} recipientPrivate - A recipient private key
     * @param {string} senderPublic - A sender public key
     * @param {Uint8Array} _payload - An encrypted message payload in bytes
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {string} - The decoded payload as hex
     */
    static _decode: (recipientPrivate: any, senderPublic: any, payload: any, iv: any, salt: any, signSchema?: SignSchema) => any;
    /**
     * Decode an encrypted message payload
     *
     * @param {string} recipientPrivate - A recipient private key
     * @param {string} senderPublic - A sender public key
     * @param {string} _payload - An encrypted message payload
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {string} - The decoded payload as hex
     */
    static decode: (recipientPrivate: any, senderPublic: any, _payload: any, signSchema?: SignSchema) => string;
    /**
     * Generate random bytes by length
     * @param {number} length - The length of the random bytes
     *
     * @return {Uint8Array}
     */
    static randomBytes: (length: any) => any;
}
