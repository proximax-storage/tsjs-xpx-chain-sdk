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

import { Crypto, KeyPair, DerivationScheme } from '../../core/crypto';
import { Convert as convert, RawAddress as AddressLibrary } from '../../core/format';
import { NetworkType } from '../blockchain/NetworkType';
import { AggregateTransaction } from '../transaction/AggregateTransaction';
import { CosignatureSignedTransaction } from '../transaction/CosignatureSignedTransaction';
import { CosignatureTransaction } from '../transaction/CosignatureTransaction';
import { EncryptedMessage } from '../transaction/EncryptedMessage';
import { PlainMessage } from '../transaction/PlainMessage';
import { SignedTransaction } from '../transaction/SignedTransaction';
import { Transaction } from '../transaction/Transaction';
import { Address } from './Address';
import { PublicAccount } from './PublicAccount';

interface IKeyPair {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
}

/**
 * The account structure describes an account private key, public key, address and allows signing transactions.
 */
export class Account {

    /**
     * @internal
     * @param address
     * @param keyPair
     * @param version the account version, default to version 2 
     */
    private constructor(
        /**
         * The account address.
         */
        public readonly address: Address,
        /**
         * The account keyPair, public and private key.
         */
        private readonly keyPair: IKeyPair,
        /**
         * The account version.
         */
        public readonly version: number = 1){
    }

    /**
     * Create an Account from a given private key
     * @param privateKey - Private key from an account
     * @param networkType - Network type
     * @return {Account}
     */
    public static createFromPrivateKeyV1(privateKey: string,
        networkType: NetworkType): Account {
        const keyPair: IKeyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, DerivationScheme.Ed25519Sha3);
        const address = AddressLibrary.addressToString(
            AddressLibrary.publicKeyToAddress(keyPair.publicKey, networkType));
        return new Account(
            Address.createFromRawAddress(address),
            keyPair,
            1
        );
    }

    /**
     * Create an Account from a given private key
     * @param privateKey - Private key from an account
     * @param networkType - Network type
     * @return {Account}
     */
    public static createFromPrivateKeyV2(privateKey: string,
        networkType: NetworkType): Account {
        const keyPair: IKeyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, DerivationScheme.Ed25519Sha2);
        const address = AddressLibrary.addressToString(
            AddressLibrary.publicKeyToAddress(keyPair.publicKey, networkType));
        return new Account(
            Address.createFromRawAddress(address),
            keyPair,
            2
        );
    }

    /**
     * Create an Account from a given private key
     * @param privateKey - Private key from an account
     * @param networkType - Network type
     * @param version - Account version (1 or 2)
     * @return {Account}
     */
    public static createFromPrivateKey(privateKey: string,
        networkType: NetworkType,
        version: number): Account {
        
        switch (version) {
            case 1:
                return this.createFromPrivateKeyV1(privateKey, networkType);
            case 2:
                return this.createFromPrivateKeyV2(privateKey, networkType);
            default:
                throw new Error("Invalid version number");
        }
    }

    /**
    * Create an Account from a given mnemonic string
    * mnenonic language supported, 
    * need to setDefaultWordlist to specific langauge in order to use other langauge
    * default is english
    * langauge supported:
    * chinese_simplified
    * chinese_traditional 
    * english
    * japanese
    * spanish
    * italian
    * french
    * korean
    * czech
    * portuguese
    * @param mnemonic - The mnemonic string
    * @param networkType - Network type
    * @param version - Account version (1 or 2)
    * @return {Account}
    */
    public static createFromMnemonic(mnemonic: string,
        networkType: NetworkType,
        version: number): Account {

        if(!Crypto.isValidMnemonic(mnemonic)) {
            throw Error(`Invalid mnemonic: ${mnemonic.length}`);
        }
      
        const privateKey = Crypto.mnemonicToHex(mnemonic);

        switch (version) {
            case 1:
                return this.createFromPrivateKeyV1(privateKey, networkType);
            case 2:
                return this.createFromPrivateKeyV2(privateKey, networkType);
            default:
                throw new Error("Invalid version number");
        }
    }

    /**
     * Generate a new account
     * @param networkType - Network type
     * @param version - Account version
     */
    public static generateNewAccount(networkType: NetworkType, version: number = 1): Account {
        // Create random bytes
        const randomBytesArray = Crypto.randomBytes(32);
        // Hash random bytes with entropy seed
        // Finalize and keep only 32 bytes
        const hashKey = convert.uint8ArrayToHex(randomBytesArray);

        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(version);

        // Create KeyPair from hash key
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(hashKey, dScheme);

        const address = Address.createFromPublicKey(convert.uint8ArrayToHex(keyPair.publicKey), networkType);
        return new Account(address, keyPair, version);
    }
    /**
     * Create a new encrypted Message
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @returns {EncryptedMessage}
     */
    public encryptMessage(message: string,
        recipientPublicAccount: PublicAccount): EncryptedMessage {

        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(this.version);

        return EncryptedMessage.create(message, recipientPublicAccount, this.privateKey, dScheme);
    }

    /**
     * Decrypts an encrypted message
     * @param encryptedMessage - Encrypted message
     * @param publicAccount - The public account originally encrypted the message
     * @returns {PlainMessage}
     */
    public decryptMessage(encryptedMessage: EncryptedMessage,
        publicAccount: PublicAccount): PlainMessage {

        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(this.version);

        return EncryptedMessage.decrypt(encryptedMessage, this.privateKey, publicAccount, dScheme);
    }
    /**
     * Account public key.
     * @return {string}
     */
    get publicKey(): string {
        return convert.uint8ArrayToHex(this.keyPair.publicKey);
    }

    /**
     * Public account.
     * @return {PublicAccount}
     */
    get publicAccount(): PublicAccount {
        return PublicAccount.createFromPublicKey(this.publicKey, this.address.networkType, this.version);
    }

    /**
     * Account private key.
     * @return {string}
     */
    get privateKey(): string {
        return convert.uint8ArrayToHex(this.keyPair.privateKey);
    }

    /**
     * Account private key represent by mnemonic
     * @return {string}
     */
    get mnemonic(): string{
        return Crypto.entropyToMnemonic(this.privateKey);
    }

    /**
     * Sign a transaction
     * @param transaction - The transaction to be signed.
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    public sign(transaction: Transaction, generationHash): SignedTransaction {
        return transaction.signWith(this, generationHash);
    }

    /**
     * Sign a transaction
     * @param transaction - The transaction to be signed.
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    public preV2Sign(transaction: Transaction, generationHash): SignedTransaction {
        return transaction.preV2SignWith(this, generationHash);
    }

    /**
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param transaction - The aggregate transaction to be signed.
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    public signTransactionWithCosignatories(transaction: AggregateTransaction,
        cosignatories: Account[], generationHash: string): SignedTransaction {

        return transaction.signTransactionWithCosignatories(this, cosignatories, generationHash);
    }

    /**
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param transaction - The aggregate transaction to be signed.
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    public signTransactionWithCosignatoriesV1(transaction: AggregateTransaction,
        cosignatories: Account[], generationHash: string): SignedTransaction {

        return transaction.signTransactionWithCosignatoriesV1(this, cosignatories, generationHash);
    }

    /**
     * Sign aggregate signature transaction
     * @param cosignatureTransaction - The aggregate signature transaction.
     * @return {CosignatureSignedTransaction}
     */
    public signCosignatureTransaction(cosignatureTransaction: CosignatureTransaction): CosignatureSignedTransaction {
        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(this.version);
        return cosignatureTransaction.signWith(this);
    }

    /**
     * Sign aggregate signature transaction
     * @param cosignatureTransaction - The aggregate signature transaction.
     * @return {CosignatureSignedTransaction}
     */
    public preV2SignCosignatureTransaction(cosignatureTransaction: CosignatureTransaction): CosignatureSignedTransaction {
        return cosignatureTransaction.preV2SignWith(this);
    }

    /**
     * Sign raw data
     * @param data - Data to be signed
     * @return {string} - Signed data result
     */
    public signData(data: string): string {

        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(this.version);

        return convert.uint8ArrayToHex(KeyPair.sign(this.keyPair,
            convert.hexToUint8(convert.utf8ToHex(data)),
            dScheme,
        ));
    }

    /**
     * Sign hexadecimal string (bytes representation)
     * @param hexString - Hex string to be signed
     * @return {string} - Signed data result
     */
    public signHexString(hexString: string): string {

        const dScheme = PublicAccount.getDerivationSchemeFromAccVersion(this.version);

        if(!convert.isHexString(hexString))
            throw new Error('Invalid hex string');

        return convert.uint8ArrayToHex(KeyPair.sign(this.keyPair,
            convert.hexToUint8(hexString),
            dScheme,
        ));
    }
}
