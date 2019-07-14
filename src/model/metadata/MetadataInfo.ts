// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import { Metadata } from "./Metadata";

/**
 * Wrapper around Metadata class as returned from rest api
 */
export class MetadataInfo {
    constructor(
        public readonly metadata: Metadata
    ) {
        
    }
}
