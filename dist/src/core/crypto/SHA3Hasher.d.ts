export declare class SHA3Hasher {
    /**
     * Calculates the hash of data.
     * @param {Uint8Array} dest The computed hash destination.
     * @param {Uint8Array} data The data to hash.
     * @param {numeric} length The hash length in bytes.
     */
    static func: (dest: any, data: any, length: any) => void;
    /**
     * Creates a hasher object.
     * @param {numeric} length The hash length in bytes.
     * @returns {object} The hasher.
     */
    static createHasher: (length?: number) => {
        reset: () => void;
        update: (data: any) => void;
        finalize: (result: any) => void;
    };
    /**
     * Get a hasher instance.
     * @param {numeric} length The hash length in bytes.
     * @returns {object} The hasher.
     */
    static getHasher: (length?: number) => any;
}
