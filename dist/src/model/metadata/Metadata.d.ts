import { MetadataType } from "./MetadataType";
import { Field } from "./Field";
/**
 * Metadata is an array of key/value pairs which can be associated with an address/namespace/mosaic
 */
export declare class Metadata {
    readonly metadataType: MetadataType;
    readonly fields: Field[];
    /**
     * Constructor
     * @param metadataType
     * @param fields
     */
    constructor(metadataType: MetadataType, fields: Field[]);
}
