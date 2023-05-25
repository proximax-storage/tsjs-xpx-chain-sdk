/*
 * Copyright 2023 ProximaX
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
import {Crypto, KeyPair} from '../../core/crypto';
import { Convert as convert} from '../../core/format';
import {Account} from '../account/Account';
import {PublicAccount} from '../account/PublicAccount';
import {Address} from '../account/Address';
import {NetworkType} from '../blockchain/NetworkType';
import {EncryptedPrivateKey} from './EncryptedPrivateKey';
import {Password} from './Password';
import {Wallet} from './Wallet';

/**
 * Simple wallet model generates a private key from a PRNG
 */
export class SimpleWallet extends Wallet {

    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param encryptedPrivateKey
     * @param version - Account version
     */
    constructor(name: string,
                network: NetworkType,
                publicAccount: PublicAccount,
                creationDate: LocalDateTime,
                /**
                 * The encrypted private key and information to decrypt it
                 */
                public readonly encryptedPrivateKey: EncryptedPrivateKey,

                /**
                 * The account version
                 */
                public readonly version: number = 1
                ) {
        super(name, network, publicAccount, creationDate, 'sirius_dual');
    }

    /**
     * Create a Simple wallet
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param network - Network id
     * @param version - The account version
     * @returns {SimpleWallet}
     */
    public static create(name: string,
                         password: Password,
                         network: NetworkType,
                         version: number = 1): SimpleWallet {
        // Create random bytes
        const randomBytesArray = Crypto.randomBytes(32);
        // Hash random bytes with entropy seed
        // Finalize and keep only 32 bytes
        const hashKey = convert.uint8ArrayToHex(randomBytesArray); // TODO: derive private key correctly

        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(version);

        // Create KeyPair from hash key
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(hashKey, dScheme);

        // Create publicAccount from public key
        const publicAccount = PublicAccount.createFromPublicKey(convert.uint8ArrayToHex(keyPair.publicKey), network);

        // Encrypt private key using password
        const encrypted = Crypto.encodePrivateKey(hashKey, password.value);

        const encryptedPrivateKey = new EncryptedPrivateKey(encrypted.ciphertext, encrypted.iv);

        return new SimpleWallet(name, network, publicAccount, LocalDateTime.now(), encryptedPrivateKey, version);
    }

    /**
     * Create a SimpleWallet from private key
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param privateKey - Wallet private key
     * @param network - Network id
     * @param version - Account version
     * @returns {SimpleWallet}
     */
    static createFromPrivateKey(name: string,
                                password: Password,
                                privateKey: string,
                                network: NetworkType,
                                version: number = 1): SimpleWallet {
        // Create KeyPair from hash key
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, PublicAccount.getDerivationSchemeFromAccVersion(version));

        // Create publicAccount from public key
        const publicAccount = PublicAccount.createFromPublicKey(convert.uint8ArrayToHex(keyPair.publicKey), network);

        // Encrypt private key using password
        const encrypted = Crypto.encodePrivateKey(privateKey, password.value);

        const encryptedPrivateKey = new EncryptedPrivateKey(encrypted.ciphertext, encrypted.iv);

        return new SimpleWallet(name, network, publicAccount, LocalDateTime.now(), encryptedPrivateKey, version);
    }

    /**
     * Create a SimpleWallet from private key
     * @param name - Wallet name
     * @param encryptedPrivateKey - EncryptedPrivateKey
     * @param publicKey - Public Key
     * @param network - Network id
     * @param version - Account version
     * @returns {SimpleWallet}
     */
     static createFromEncryptedKey(name: string,
        encryptedKey: string,
        iv: string,
        publicKey: string,
        network: NetworkType,
        version: number = 1): SimpleWallet {

        // Create publicAccount from public key
        const publicAccount = PublicAccount.createFromPublicKey(publicKey, network);

        const encryptedPrivateKey = new EncryptedPrivateKey(encryptedKey, iv);

        return new SimpleWallet(name, network, publicAccount, LocalDateTime.now(), encryptedPrivateKey, version);
    }

    /**
     * Open a wallet and generate an Account
     * @param password - Password to decrypt private key
     * @returns {Account}
     */
    public open(password: Password): Account {
        return Account.createFromPrivateKey(this.encryptedPrivateKey.decrypt(password), this.network, this.version);
    }

}
