/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {LocalDateTime} from '@js-joda/core';
import {Account} from '../account/Account';
import {PublicAccount} from '../account/PublicAccount';
import {NetworkType} from '../blockchain/NetworkType';
import {Password} from './Password';

/**
 * Wallet base model
 */
export abstract class Wallet {
    /**
     * @internal
     * @param name
     * @param network
     * @param publicAccount
     * @param creationDate
     * @param schema
     */
    constructor(
                /**
                 * The wallet's name
                 */
                public readonly name: string,
                /**
                 * The wallet's network
                 */
                public readonly network: NetworkType,
                /**
                 * The wallet's publicAccount
                 */
                public readonly publicAccount: PublicAccount,
                /**
                 * The wallet's creation date
                 */
                public readonly creationDate: LocalDateTime,
                /**
                 * Wallet schema number
                 */
                public readonly schema: string) {

    }

    /**
     * Abstract open wallet method returning an account from current wallet.
     * @param password - Password to open wallet.
     * @returns {Account}
     */
    public abstract open(password: Password): Account;
}
