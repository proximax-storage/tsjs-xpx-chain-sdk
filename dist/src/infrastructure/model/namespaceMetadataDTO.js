"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
class NamespaceMetadataDTO {
    static getAttributeTypeMap() {
        return NamespaceMetadataDTO.attributeTypeMap;
    }
}
NamespaceMetadataDTO.discriminator = undefined;
NamespaceMetadataDTO.attributeTypeMap = [
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
exports.NamespaceMetadataDTO = NamespaceMetadataDTO;
//# sourceMappingURL=namespaceMetadataDTO.js.map