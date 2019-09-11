"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
class MetadataDTO {
    static getAttributeTypeMap() {
        return MetadataDTO.attributeTypeMap;
    }
}
MetadataDTO.discriminator = undefined;
MetadataDTO.attributeTypeMap = [
    {
        "name": "metadataType",
        "baseName": "metadataType",
        "type": "number"
    },
    {
        "name": "fields",
        "baseName": "fields",
        "type": "Array<FieldDTO>"
    }
];
exports.MetadataDTO = MetadataDTO;
//# sourceMappingURL=metadataDTO.js.map