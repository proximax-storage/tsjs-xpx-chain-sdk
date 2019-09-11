"use strict";
// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file
Object.defineProperty(exports, "__esModule", { value: true });
class NamespaceMetadataInfoDTO {
    static getAttributeTypeMap() {
        return NamespaceMetadataInfoDTO.attributeTypeMap;
    }
}
NamespaceMetadataInfoDTO.discriminator = undefined;
NamespaceMetadataInfoDTO.attributeTypeMap = [
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "NamespaceMetadataDTO"
    }
];
exports.NamespaceMetadataInfoDTO = NamespaceMetadataInfoDTO;
//# sourceMappingURL=namespaceMetadataInfoDTO.js.map