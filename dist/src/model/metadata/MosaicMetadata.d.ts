import { Metadata } from "./Metadata";
import { MosaicId } from "../mosaic/MosaicId";
import { MetadataType } from "./MetadataType";
import { Field } from "./Field";
/**
 * Specialization of Metadata for Mosaics
 */
export declare class MosaicMetadata extends Metadata {
    readonly metadataId: MosaicId;
    readonly metadataType: MetadataType;
    readonly fields: Field[];
    /**
     * Constructor
     * @param metadataId
     * @param metadataType
     * @param fields
     */
    constructor(metadataId: MosaicId, metadataType: MetadataType, fields: Field[]);
}
