/**
 * Catapult REST API Reference
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.15
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { MosaicPropertyDTO } from './mosaicPropertyDTO';
export declare class MosaicDefinitionDTO {
    'mosaicId': Array<number>;
    'supply': Array<number>;
    'height': Array<number>;
    /**
    * The public key of the mosaic owner.
    */
    'owner': string;
    /**
    * The number of definitions for the same mosaic.
    */
    'revision': number;
    'properties': Array<MosaicPropertyDTO>;
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
