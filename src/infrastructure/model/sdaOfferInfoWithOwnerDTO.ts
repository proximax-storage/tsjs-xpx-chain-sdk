/**
 *
 */

import { RequestFile } from '../api';

export class SdaOfferInfoWithOwnerDTO {
    'mosaicIdGive': Array<number>;
    'mosaicIdGet': Array<number>;
    'currentMosaicGiveAmount': Array<number>;
    'currentMosaicGetAmount': Array<number>;
    'initialMosaicGiveAmount': Array<number>;
    'initialMosaicGetAmount': Array<number>;
    'deadline': Array<number>;
    'owner': string;
    
    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "mosaicIdGive",
            "baseName": "mosaicIdGive",
            "type": "Array<number>"
        },
        {
            "name": "mosaicIdGet",
            "baseName": "mosaicIdGet",
            "type": "Array<number>"
        },
        {
            "name": "currentMosaicGiveAmount",
            "baseName": "currentMosaicGiveAmount",
            "type": "Array<number>"
        },
        {
            "name": "currentMosaicGetAmount",
            "baseName": "currentMosaicGetAmount",
            "type": "Array<number>"
        },
        {
            "name": "initialMosaicGiveAmount",
            "baseName": "initialMosaicGiveAmount",
            "type": "Array<number>"
        },
        {
            "name": "initialMosaicGetAmount",
            "baseName": "initialMosaicGetAmount",
            "type": "Array<number>"
        },
        {
            "name": "deadline",
            "baseName": "deadline",
            "type": "Array<number>"
        },
        {
            "name": "owner",
            "baseName": "owner",
            "type": "string"
        }
    ];

    

    static getAttributeTypeMap() {
        return SdaOfferInfoWithOwnerDTO.attributeTypeMap;
    }
}

