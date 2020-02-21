// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {Address} from '../account/Address';
import {UInt64} from '../UInt64';

/**
 * The richlist entry describes the account details and its specific mosaic ownership.
 */
export class RichlistEntry {

    /**
     * @internal
     * @param address
     * @param publicKey
     * @param amount
     */
    private constructor(
                        /**
                         * The account address.
                         */
                        public readonly address: Address,
                        /**
                         * The account public key.
                         */
                        public readonly publicKey: string,
                        /**
                         * The mosaic amount
                         */
                        public readonly amount: UInt64) {
    }

    /**
     * Create a Richlist Entry
     * @param address - Address of the account
     * @param publicKey - Public Key of the account
     * @param amount - The mosaic amount
     * @return {RichlistEntry}
     */
    public static create(address: Address,
                         publicKey: string,
                         amount: UInt64): RichlistEntry {
        return new RichlistEntry(address, publicKey, amount);
    }
}
