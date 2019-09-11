import { Metadata } from "./Metadata";
import { MetadataType } from "./MetadataType";
import { NamespaceId } from "../namespace/NamespaceId";
import { Field } from "./Field";
/**
 * Metadata specialization for namespace
 */
export declare class NamespaceMetadata extends Metadata {
    metadataId: NamespaceId;
    readonly metadataType: MetadataType;
    readonly fields: Field[];
    /**
     * Constructor
     * @param metadataId
     * @param metadataType
     * @param fields
     */
    constructor(metadataId: NamespaceId, metadataType: MetadataType, fields: Field[]);
}
