export declare class IdGenerator {
    /**
     * Generates a mosaic id given a nonce and a public id.
     * @param {object} nonce The mosaic nonce.
     * @param {object} ownerPublicId The public id.
     * @returns {module:coders/uint64~uint64} The mosaic id.
     */
    static generateMosaicId: (nonce: any, ownerPublicId: any) => number[];
    /**
     * Parses a unified namespace name into a path.
     * @param {string} name The unified namespace name.
     * @returns {array<module:coders/uint64~uint64>} The namespace path.
     */
    static generateNamespacePath: (name: string) => never[];
}
