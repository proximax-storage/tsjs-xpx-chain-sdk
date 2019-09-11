"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
class MosaicMetadataDTO {
    static getAttributeTypeMap() {
        return MosaicMetadataDTO.attributeTypeMap;
    }
}
MosaicMetadataDTO.discriminator = undefined;
MosaicMetadataDTO.attributeTypeMap = [
    {
        "name": "metadataType",
        "baseName": "metadataType",
        "type": "number"
    },
    {
        "name": "fields",
        "baseName": "fields",
        "type": "Array<FieldDTO>"
    },
    {
        "name": "metadataId",
        "baseName": "metadataId",
        "type": "Array<number>"
    }
];
exports.MosaicMetadataDTO = MosaicMetadataDTO;
//# sourceMappingURL=mosaicMetadataDTO.js.map