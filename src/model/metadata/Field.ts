// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * Key value storage for metadata fields
 */
export class Field {
    /**
     * Constructor
     * @param key 
     * @param value 
     */
    constructor(
        public readonly key: string,

        public readonly value: string
    ) {

    }
}
