export declare class Convert {
    /**
     * Decodes two hex characters into a byte.
     * @param {string} char1 The first hex digit.
     * @param {string} char2 The second hex digit.
     * @returns {number} The decoded byte.
     */
    static toByte: (char1: string, char2: string) => number;
    /**
     * Determines whether or not a string is a hex string.
     * @param {string} input The string to test.
     * @returns {boolean} true if the input is a hex string, false otherwise.
     */
    static isHexString: (input: string) => boolean;
    /**
     * Converts a hex string to a uint8 array.
     * @param {string} input A hex encoded string.
     * @returns {Uint8Array} A uint8 array corresponding to the input.
     */
    static hexToUint8: (input: string) => Uint8Array;
    /**
     * Reversed convertion hex string to a uint8 array.
     * @param {string} input A hex encoded string.
     * @returns {Uint8Array} A uint8 array corresponding to the input.
     */
    static hexToUint8Reverse: (input: string) => Uint8Array;
    /**
     * Converts a uint8 array to a hex string.
     * @param {Uint8Array} input A uint8 array.
     * @returns {string} A hex encoded string corresponding to the input.
     */
    static uint8ToHex: (input: any) => string;
    /**
     * Converts a uint8 array to a uint32 array.
     * @param {Uint8Array} input A uint8 array.
     * @returns {Uint32Array} A uint32 array created from the input.
     */
    static uint8ToUint32: (input: any) => Uint32Array;
    /**
     * Converts a uint32 array to a uint8 array.
     * @param {Uint32Array} input A uint32 array.
     * @returns {Uint8Array} A uint8 array created from the input.
     */
    static uint32ToUint8: (input: Uint32Array) => Uint8Array;
    /** Converts an unsigned byte to a signed byte with the same binary representation.
     * @param {number} input An unsigned byte.
     * @returns {number} A signed byte with the same binary representation as the input.
     *
     */
    static uint8ToInt8: (input: number) => number;
    /** Converts a signed byte to an unsigned byte with the same binary representation.
     * @param {number} input A signed byte.
     * @returns {number} An unsigned byte with the same binary representation as the input.
     */
    static int8ToUint8: (input: number) => number;
    /**
     * Converts a raw javascript string into a string of single byte characters using utf8 encoding.
     * This makes it easier to perform other encoding operations on the string.
     * @param {string} input - A raw string
     * @return {string} - UTF-8 string
     */
    static rstr2utf8: (input: string) => string;
    /**
     * Convert UTF-8 to hex
     * @param {string} input - An UTF-8 string
     * @return {string}
     */
    static utf8ToHex: (input: string) => string;
}
