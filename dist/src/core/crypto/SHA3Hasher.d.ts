import { SignSchema } from './SignSchema';
export declare class SHA3Hasher {
    /**
     * Calculates the hash of data.
     * @param {Uint8Array} dest The computed hash destination.
     * @param {Uint8Array} data The data to hash.
     * @param {numeric} length The hash length in bytes.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     */
    static func: (dest: any, data: any, length: any, signSchema?: SignSchema) => void;
    /**
     * Creates a hasher object.
     * @param {numeric} length The hash length in bytes.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {object} The hasher.
     */
    static createHasher: (length?: number, signSchema?: SignSchema) => {
        reset: () => void;
        update: (data: any) => void;
        finalize: (result: any) => void;
    };
    /**
     * Get a hasher instance.
     * @param {numeric} length The hash length in bytes.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {object} The hasher.
     */
    static getHasher: (length?: number, signSchema?: SignSchema) => any;
}
