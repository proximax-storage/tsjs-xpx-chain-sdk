import { MetadataType } from "./MetadataType";
import { Field } from "./Field";

/**
 * Metadata is an array of key/value pairs which can be associated with an address/namespace/mosaic
 */
export class Metadata {

    /**
     * Constructor
     * @param metadataType 
     * @param fields 
     */
    constructor(
        /* type of metadata */
        public readonly metadataType: MetadataType,

        /* array of key/value pairs */
        public readonly fields: Field[]
    ) {

    }
}