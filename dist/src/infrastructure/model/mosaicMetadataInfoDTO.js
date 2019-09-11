"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
class MosaicMetadataInfoDTO {
    static getAttributeTypeMap() {
        return MosaicMetadataInfoDTO.attributeTypeMap;
    }
}
MosaicMetadataInfoDTO.discriminator = undefined;
MosaicMetadataInfoDTO.attributeTypeMap = [
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "MosaicMetadataDTO"
    }
];
exports.MosaicMetadataInfoDTO = MosaicMetadataInfoDTO;
//# sourceMappingURL=mosaicMetadataInfoDTO.js.map