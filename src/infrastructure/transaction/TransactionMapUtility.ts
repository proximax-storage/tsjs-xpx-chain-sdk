/*
 * Copyright 2023 ProximaX
 * Copyright 2019 NEM
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
import {NetworkType} from '../../model/blockchain/NetworkType';
import {Address} from '../../model/account/Address';
import {NamespaceId} from '../../model/namespace/NamespaceId';
import {Convert as convert} from '../../core/format';
import {PublicAccount} from '../../model/account/PublicAccount';
import {Mosaic} from '../../model/mosaic/Mosaic';
import {MosaicId} from '../../model/mosaic/MosaicId';
import {RawUInt64 as UInt64Library} from '../../core/format';
import {UInt64} from '../../model/UInt64';
import {Id} from '../../model/Id';
import { EncryptedMessage } from '../../model/transaction/EncryptedMessage';
import { Message } from '../../model/transaction/Message';
import { MessageType } from '../../model/transaction/MessageType';
import { PlainMessage } from '../../model/transaction/PlainMessage';
import { HexadecimalMessage } from '../../model/transaction/HexadecimalMessage';

export class TransactionMapUtility{

    public static extractTransactionTypeVersion(version: number): number{
        return parseInt((version >>> 0).toString(16).substring(4), 16); // ">>> 0" hack makes it effectively an Uint32
    };
    
    public static extractTransactionDerivationScheme(version: number): number{
        return parseInt((version >>> 0).toString(16).substring(2, 4), 16); // ">>> 0" hack makes it effectively an Uint32
    };

    public static extractNetworkType(version: number): NetworkType{
        const networkType = parseInt((version >>> 0).toString(16).substring(0, 2), 16); // ">>> 0" hack makes it effectively an Uint32
        if (networkType === NetworkType.MAIN_NET) {
            return NetworkType.MAIN_NET;
        } else if (networkType === NetworkType.TEST_NET) {
            return NetworkType.TEST_NET;
        } else if (networkType === NetworkType.PRIVATE) {
            return NetworkType.PRIVATE;
        } else if (networkType === NetworkType.PRIVATE_TEST) {
            return NetworkType.PRIVATE_TEST;
        } else if (networkType === NetworkType.MIJIN) {
            return NetworkType.MIJIN;
        } else if (networkType === NetworkType.MIJIN_TEST) {
            return NetworkType.MIJIN_TEST;
        }
        throw new Error('Unimplemented network type');
    };

    /**
     * Extract recipient value from encoded hexadecimal notation.
     * @param recipient {string} Encoded hexadecimal recipient notation
     * @return {Address | NamespaceId}
     */
    public static extractRecipient(recipient: any): Address | NamespaceId{
        if (typeof recipient === 'string') {
            // If bit 0 of byte 0 is not set (like in 0x90), then it is a regular address.
            // Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
            const bit0 = convert.hexToUint8(recipient.substring(1, 3))[0];
            if ((bit0 & 16) === 16) {
                // namespaceId encoded hexadecimal notation provided
                // only 8 bytes are relevant to resolve the NamespaceId
                const relevantPart = recipient.substring(2, 18);
                return NamespaceId.createFromEncoded(relevantPart);
            }

            // read address from encoded hexadecimal notation
            return Address.createFromEncoded(recipient);
        } else if (typeof recipient === 'object') { // Is JSON object
            if (recipient.hasOwnProperty('address')) {
                return Address.createFromRawAddress(recipient.address);
            } else if (recipient.hasOwnProperty('id')) {
                return new NamespaceId(recipient.id);
            }
        }
        throw new Error(`Recipient: ${recipient} type is not recognised`);
    };

    /**
     * Extract mosaics from encoded UInt64 notation.
     *
     * If most significant bit of byte 0 is set, then it is a namespaceId.
     * If most significant bit of byte 0 is not set, then it is a mosaicId.
     *
     * @param mosaics {Array | undefined} The DTO array of mosaics (with UInt64 Id notation)
     * @return {Mosaic[]}
     */
    public static extractMosaics = (mosaics: any): Mosaic[] => {

        if (mosaics === undefined) {
            return [];
        }

        return mosaics.map((mosaicDTO) => {

            // convert ID to UInt8 bytes array and get first byte (most significant byte)
            const uint64 = new Id(mosaicDTO.id);
            const bytes = convert.hexToUint8(UInt64Library.toHex(uint64.toDTO()));
            const byte0 = bytes[0];

            // if most significant bit of byte 0 is set, then we have a namespaceId
            if ((byte0 & 128) === 128) {
                return new Mosaic(new NamespaceId(mosaicDTO.id), new UInt64(mosaicDTO.amount));
            }

            // most significant bit of byte 0 is not set => mosaicId
            return new Mosaic(new MosaicId(mosaicDTO.id), new UInt64(mosaicDTO.amount));
        });
    };

    /**
     * Extract beneficiary public key from DTO.
     *
     * @todo Upgrade of catapult-rest WITH catapult-service-bootstrap versioning.
     *
     * With `cow` upgrade (nemtech/catapult-server@0.3.0.2), `catapult-rest` block DTO
     * was updated and latest catapult-service-bootstrap uses the wrong block DTO.
     * This will be fixed with next catapult-server upgrade to `dragon`.
     *
     * :warning It is currently not possible to read the block's beneficiary public key
     * except when working with a local instance of `catapult-rest`.
     *
     * @param beneficiary {string | undefined} The beneficiary public key if set
     * @return {Mosaic[]}
     */
    public static extractBeneficiary = (
        blockDTO: any,
        networkType: NetworkType,
    ): PublicAccount | undefined => {

        let dtoPublicAccount: PublicAccount | undefined;
        let dtoFieldValue: string | undefined;
        if (blockDTO.block.beneficiaryPublicKey) {
            dtoFieldValue = blockDTO.block.beneficiaryPublicKey;
        } else if (blockDTO.block.beneficiary) {
            dtoFieldValue = blockDTO.block.beneficiary;
        }

        if (! dtoFieldValue) {
            return undefined;
        }

        try {
            // @FIX with latest catapult-service-bootstrap version, catapult-rest still returns
            //      a `string` formatted copy of the public *when it is set at all*.
            dtoPublicAccount = PublicAccount.createFromPublicKey(dtoFieldValue, networkType);
        } catch (e) { dtoPublicAccount =  undefined; }

        return dtoPublicAccount;
    };

    /**
    * @internal
    * @param messageType - Message Type
    * @param payload - Message Payload
    * @returns {Message}
    */
    public static extractMessage = (messageType: MessageType, payload: string): Message => {
       if (messageType === MessageType.PlainMessage) {
           return PlainMessage.createFromPayload(payload);
       } else if (messageType === MessageType.EncryptedMessage) {
           return EncryptedMessage.createFromPayload(payload);
       } else if (messageType === MessageType.HexadecimalMessage) {
           return HexadecimalMessage.createFromPayload(payload);
       } else {
           throw new Error('Invalid message type');
       }
   };
}