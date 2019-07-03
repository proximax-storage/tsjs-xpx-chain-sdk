export declare class Base32 {
    /**
     * Base32 encodes a binary buffer.
     * @param {Uint8Array} data The binary data to encode.
     * @returns {string} The base32 encoded string corresponding to the input data.
     */
    static Base32Encode: (data: Uint8Array) => string;
    /**
     * Base32 decodes a base32 encoded string.
     * @param {string} encoded The base32 encoded string to decode.
     * @returns {Uint8Array} The binary data corresponding to the input string.
     */
    static Base32Decode: (encoded: string) => Uint8Array;
}
