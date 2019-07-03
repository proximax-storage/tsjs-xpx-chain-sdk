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
import { ResolutionStatementDTO } from './resolutionStatementDTO';
import { TransactionStatementDTO } from './transactionStatementDTO';
/**
* The collection of transaction statements and resolutions triggered for the block requested.
*/
export declare class StatementsDTO {
    /**
    * The array of transaction statements for the block requested.
    */
    'transactionStatements': Array<TransactionStatementDTO>;
    /**
    * The array of address resolutions for the block requested.
    */
    'addressResolutionStatements': Array<ResolutionStatementDTO>;
    /**
    * The array of mosaic resolutions for the block requested.
    */
    'mosaicResolutionStatements': Array<ResolutionStatementDTO>;
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
