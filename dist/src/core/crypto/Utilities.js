"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
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
const format_1 = require("../format");
const nacl = require("./nacl_catapult");
const SHA3Hasher_1 = require("./SHA3Hasher");
exports.CryptoJS = require('crypto-js');
exports.Key_Size = 32;
exports.Signature_Size = 64;
exports.Half_Signature_Size = exports.Signature_Size / 2;
exports.Hash_Size = 64;
exports.Half_Hash_Size = exports.Hash_Size / 2;
/**
 * Convert an Uint8Array to WordArray
 *
 * @param {Uint8Array} ua - An Uint8Array
 * @param {number} uaLength - The Uint8Array length
 *
 * @return {WordArray}
 */
exports.ua2words = (ua, uaLength) => {
    const temp = [];
    for (let i = 0; i < uaLength; i += 4) {
        const x = ua[i] * 0x1000000 + (ua[i + 1] || 0) * 0x10000 + (ua[i + 2] || 0) * 0x100 + (ua[i + 3] || 0);
        temp.push((x > 0x7fffffff) ? x - 0x100000000 : x);
    }
    return exports.CryptoJS.lib.WordArray.create(temp, uaLength);
};
/**
 * Convert a wordArray to Uint8Array
 *
 * @param {Uint8Array} destUa - A destination Uint8Array
 * @param {WordArray} cryptoWords - A wordArray
 *
 * @return {Uint8Array}
 */
exports.words2ua = (destUa, cryptoWords) => {
    for (let i = 0; i < destUa.length; i += 4) {
        let v = cryptoWords.words[i / 4];
        if (v < 0) {
            v += 0x100000000;
        }
        destUa[i] = (v >>> 24);
        destUa[i + 1] = (v >>> 16) & 0xff;
        destUa[i + 2] = (v >>> 8) & 0xff;
        destUa[i + 3] = v & 0xff;
    }
    return destUa;
};
exports.catapult_hash = {
    func: SHA3Hasher_1.SHA3Hasher.func,
    createHasher: SHA3Hasher_1.SHA3Hasher.createHasher,
};
// custom catapult crypto functions
exports.catapult_crypto = (function () {
    function clamp(d) {
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
    }
    function prepareForScalarMult(sk, hashfunc, signSchema) {
        const d = new Uint8Array(exports.Hash_Size);
        hashfunc(d, sk, exports.Hash_Size, signSchema);
        clamp(d);
        return d;
    }
    const encodedSChecker = (function () {
        const Is_Reduced = 1;
        const Is_Zero = 2;
        function validateEncodedSPart(s) {
            if (format_1.RawArray.isZeroFilled(s)) {
                return Is_Zero | Is_Reduced;
            }
            const copy = new Uint8Array(exports.Signature_Size);
            format_1.RawArray.copy(copy, s, exports.Half_Signature_Size);
            nacl.reduce(copy);
            return format_1.RawArray.deepEqual(s, copy, exports.Half_Signature_Size) ? Is_Reduced : 0;
        }
        return {
            isCanonical: (s) => Is_Reduced === validateEncodedSPart(s),
            requireValid: (s) => {
                if (0 === (validateEncodedSPart(s) & Is_Reduced)) {
                    throw Error('S part of signature invalid');
                }
            },
        };
    })();
    return {
        extractPublicKey: (sk, hashfunc, signSchema) => {
            const c = nacl;
            const d = prepareForScalarMult(sk, hashfunc, signSchema);
            const p = [c.gf(), c.gf(), c.gf(), c.gf()];
            const pk = new Uint8Array(exports.Key_Size);
            c.scalarbase(p, d);
            c.pack(pk, p);
            return pk;
        },
        sign: (m, pk, sk, hasher) => {
            const c = nacl;
            const d = new Uint8Array(exports.Hash_Size);
            hasher.reset();
            hasher.update(sk);
            hasher.finalize(d);
            clamp(d);
            const r = new Uint8Array(exports.Hash_Size);
            hasher.reset();
            hasher.update(d.subarray(exports.Half_Hash_Size));
            hasher.update(m);
            hasher.finalize(r);
            const p = [c.gf(), c.gf(), c.gf(), c.gf()];
            const signature = new Uint8Array(exports.Signature_Size);
            c.reduce(r);
            c.scalarbase(p, r);
            c.pack(signature, p);
            const h = new Uint8Array(exports.Hash_Size);
            hasher.reset();
            hasher.update(signature.subarray(0, exports.Half_Signature_Size));
            hasher.update(pk);
            hasher.update(m);
            hasher.finalize(h);
            c.reduce(h);
            // muladd
            const x = new Float64Array(exports.Hash_Size);
            format_1.RawArray.copy(x, r, exports.Half_Hash_Size);
            for (let i = 0; i < exports.Half_Hash_Size; ++i) {
                for (let j = 0; j < exports.Half_Hash_Size; ++j) {
                    x[i + j] += h[i] * d[j];
                }
            }
            c.modL(signature.subarray(exports.Half_Signature_Size), x);
            encodedSChecker.requireValid(signature.subarray(exports.Half_Signature_Size));
            return signature;
        },
        verify: (pk, m, signature, hasher) => {
            // reject non canonical signature
            if (!encodedSChecker.isCanonical(signature.subarray(exports.Half_Signature_Size))) {
                return false;
            }
            // reject weak (zero) public key
            if (format_1.RawArray.isZeroFilled(pk)) {
                return false;
            }
            const c = nacl;
            const p = [c.gf(), c.gf(), c.gf(), c.gf()];
            const q = [c.gf(), c.gf(), c.gf(), c.gf()];
            if (c.unpackneg(q, pk)) {
                return false;
            }
            const h = new Uint8Array(exports.Hash_Size);
            hasher.reset();
            hasher.update(signature.subarray(0, exports.Half_Signature_Size));
            hasher.update(pk);
            hasher.update(m);
            hasher.finalize(h);
            c.reduce(h);
            c.scalarmult(p, q, h);
            const t = new Uint8Array(exports.Signature_Size);
            c.scalarbase(q, signature.subarray(exports.Half_Signature_Size));
            c.add(p, q);
            c.pack(t, p);
            return 0 === c.crypto_verify_32(signature, 0, t, 0);
        },
        deriveSharedKey: (salt, sk, pk, hashfunc, signSchema) => {
            const c = nacl;
            const d = prepareForScalarMult(sk, hashfunc, signSchema);
            // sharedKey = pack(p = d (derived from sk) * q (derived from pk))
            const q = [c.gf(), c.gf(), c.gf(), c.gf()];
            const p = [c.gf(), c.gf(), c.gf(), c.gf()];
            const sharedKey = new Uint8Array(exports.Key_Size);
            c.unpack(q, pk);
            c.scalarmult(p, q, d);
            c.pack(sharedKey, p);
            // salt the shared key
            for (let i = 0; i < exports.Key_Size; ++i) {
                sharedKey[i] ^= salt[i];
            }
            // return the hash of the result
            const sharedKeyHash = new Uint8Array(exports.Key_Size);
            hashfunc(sharedKeyHash, sharedKey, exports.Key_Size, signSchema);
            return sharedKeyHash;
        },
    };
})();
//# sourceMappingURL=Utilities.js.map