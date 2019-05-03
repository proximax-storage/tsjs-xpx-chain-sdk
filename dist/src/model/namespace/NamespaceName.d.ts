import { NamespaceId } from './NamespaceId';
/**
 * The namespace name info structure describes basic information of a namespace and name.
 */
export declare class NamespaceName {
    readonly namespaceId: NamespaceId;
    /**
     * The namespace name.
     */
    readonly name: string;
    /**
     * The parent id.
     */
    readonly parentId?: NamespaceId | undefined;
    /**
     * @param namespaceId
     * @param name
     */
    constructor(/**
                 * The namespace id.
                 */ namespaceId: NamespaceId, 
    /**
     * The namespace name.
     */
    name: string, 
    /**
     * The parent id.
     */
    parentId?: NamespaceId | undefined);
}
