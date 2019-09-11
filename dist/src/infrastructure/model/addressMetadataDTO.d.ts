import { FieldDTO } from './fieldDTO';
export declare class AddressMetadataDTO {
    'metadataType': number;
    'fields': Array<FieldDTO>;
    'metadataId': string;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
