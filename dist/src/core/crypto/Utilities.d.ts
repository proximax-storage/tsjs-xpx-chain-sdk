import { SignSchema } from './SignSchema';
export declare const CryptoJS: any;
export declare const Key_Size = 32;
export declare const Signature_Size = 64;
export declare const Half_Signature_Size: number;
export declare const Hash_Size = 64;
export declare const Half_Hash_Size: number;
/**
 * Convert an Uint8Array to WordArray
 *
 * @param {Uint8Array} ua - An Uint8Array
 * @param {number} uaLength - The Uint8Array length
 *
 * @return {WordArray}
 */
export declare const ua2words: (ua: any, uaLength: any) => any;
/**
 * Convert a wordArray to Uint8Array
 *
 * @param {Uint8Array} destUa - A destination Uint8Array
 * @param {WordArray} cryptoWords - A wordArray
 *
 * @return {Uint8Array}
 */
export declare const words2ua: (destUa: any, cryptoWords: any) => any;
export declare const catapult_hash: {
    func: (dest: any, data: any, length: any, signSchema?: SignSchema) => void;
    createHasher: (length?: number, signSchema?: SignSchema) => {
        reset: () => void;
        update: (data: any) => void;
        finalize: (result: any) => void;
    };
};
export declare const catapult_crypto: {
    extractPublicKey: (sk: any, hashfunc: any, signSchema: SignSchema) => Uint8Array;
    sign: (m: any, pk: any, sk: any, hasher: any) => Uint8Array;
    verify: (pk: any, m: any, signature: any, hasher: any) => boolean;
    deriveSharedKey: (salt: any, sk: any, pk: any, hashfunc: any, signSchema: SignSchema) => Uint8Array;
};
