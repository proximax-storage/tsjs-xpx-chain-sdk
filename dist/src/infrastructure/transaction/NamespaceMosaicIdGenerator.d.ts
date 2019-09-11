export declare class NamespaceMosaicIdGenerator {
    /**
     * @returns mosaic Id
     */
    static mosaicId: (nonce: any, ownerPublicId: any) => number[];
    /**
     * @returns random mosaic nonce
     */
    static generateRandomMosaicNonce: () => any;
    /**
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    static namespaceId: (namespaceName: any) => never[];
    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace parent id
     */
    static subnamespaceParentId: (parentNamespaceName: string, namespaceName: string) => never;
    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    static subnamespaceNamespaceId: (parentNamespaceName: any, namespaceName: any) => never;
}
