import { Metadata } from "./Metadata";
import { MetadataType } from "./MetadataType";
import { NamespaceId } from "../namespace/NamespaceId";
import { Field } from "./Field";

/**
 * Metadata specialization for namespace
 */
export class NamespaceMetadata extends Metadata {
    /**
     * Constructor
     * @param metadataId
     * @param metadataType 
     * @param fields 
     */
    constructor(
        /* id of namespace this metadata is associated with */
        public metadataId: NamespaceId,

        /* metadata type */
        public readonly metadataType: MetadataType,

        /* metadata key/value array */
        public readonly fields: Field[]
    ) {
        super(metadataType, fields);
    }
}