// Copyright 2023 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { DownloadChannelInfoDTO } from "./downloadChannelInfoDTO";

export class DownloadChannelInlineInfoDTO {
    downloadChannelInfo: DownloadChannelInfoDTO;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "downloadChannelInfo",
            "baseName": "downloadChannelInfo",
            "type": "DownloadChannelInfoDTO"
        }
    ];

    static getAttributeTypeMap() {
        return DownloadChannelInlineInfoDTO.attributeTypeMap;
    }
}

