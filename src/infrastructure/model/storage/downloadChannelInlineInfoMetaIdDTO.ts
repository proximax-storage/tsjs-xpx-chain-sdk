// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { MetaIdDTO } from "../metaIdDTO";
import { DownloadChannelInfoDTO } from "./downloadChannelInfoDTO";

export class DownloadChannelInlineInfoMetaIdDTO {
    downloadChannelInfo: DownloadChannelInfoDTO;
    meta: MetaIdDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "downloadChannelInfo",
            "baseName": "downloadChannelInfo",
            "type": "DownloadChannelInfoDTO"
        },
        {
            "name": "meta",
            "baseName": "meta",
            "type": "MetaIdDTO"
        }
    ];

    static getAttributeTypeMap() {
        return DownloadChannelInlineInfoMetaIdDTO.attributeTypeMap;
    }
}

