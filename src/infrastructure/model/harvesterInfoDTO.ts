// Copyright 2022 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

export class HarvesterInfoDTO {
    "key": string;
    "owner": string;
	"address": string;
	"disabledHeight": number[];
    "lastSigningBlockHeight": number[];
	"effectiveBalance": number[];
	"canHarvest": boolean;
	"activity": number;
	"greed": number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "key",
            "baseName": "key",
            "type": "string"
        },
        {
            "name": "owner",
            "baseName": "owner",
            "type": "string"
        },
        {
            "name": "address",
            "baseName": "address",
            "type": "string"
        },
        {
            "name": "disabledHeight",
            "baseName": "disabledHeight",
            "type": "Array<number>"
        },
        {
            "name": "lastSigningBlockHeight",
            "baseName": "lastSigningBlockHeight",
            "type": "Array<number>"
        },
        {
            "name": "effectiveBalance",
            "baseName": "effectiveBalance",
            "type": "Array<number>"
        },
        {
            "name": "canHarvest",
            "baseName": "canHarvest",
            "type": "boolean"
        },
        {
            "name": "activity",
            "baseName": "activity",
            "type": "number"
        },
        {
            "name": "greed",
            "baseName": "greed",
            "type": "number"
        }
    ];

    static getAttributeTypeMap() {
        return HarvesterInfoDTO.attributeTypeMap;
    }
}

