import { Metadata } from "./Metadata";
import { Address } from "../account/Address";
import { MetadataType } from "./MetadataType";
import { Field } from "./Field";
export declare class AddressMetadata extends Metadata {
    readonly metadataId: Address;
    readonly metadataType: MetadataType;
    readonly fields: Field[];
    /**
     * Constructor
     * @param metadataId
     * @param metadataType
     * @param fields
     */
    constructor(metadataId: Address, metadataType: MetadataType, fields: Field[]);
}
