export declare class RawUInt64 {
    static readonly readUint32At: (bytes: any, i: any) => number;
    /**
     * An exact uint64 representation composed of two 32bit values.
     * @typedef {Array} uint64
     * @property {number} 0 The low 32bit value.
     * @property {number} 1 The high 32bit value.
     */
    /**
     * Tries to compact a uint64 into a simple numeric.
     * @param {module:coders/uint64~uint64} uint64 A uint64 value.
     * @returns {number|module:coders/uint64~uint64}
     * A numeric if the uint64 is no greater than Number.MAX_SAFE_INTEGER or the original uint64 value otherwise.
     */
    static compact: (uint64: any) => any;
    /**
     * Converts a numeric unsigned integer into a uint64.
     * @param {number} number The unsigned integer.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    static fromUint: (number: any) => number[];
    /**
     * Converts a (64bit) uint8 array into a uint64.
     * @param {Uint8Array} uint8Array A uint8 array.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    static fromBytes: (uint8Array: any) => number[];
    /**
     * Converts a (32bit) uint8 array into a uint64.
     * @param {Uint8Array} uint8Array A uint8 array.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    static fromBytes32: (uint8Array: any) => number[];
    /**
     * Parses a hex string into a uint64.
     * @param {string} input A hex encoded string.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    static fromHex: (input: any) => number[];
    /**
     * Converts a uint64 into a hex string.
     * @param {module:coders/uint64~uint64} uint64 A uint64 value.
     * @returns {string} A hex encoded string representing the uint64.
     */
    static toHex: (uint64: any) => string;
    /**
     * Returns true if a uint64 is zero.
     * @param {module:coders/uint64~uint64} uint64 A uint64 value.
     * @returns {boolean} true if the value is zero.
     */
    static isZero: (uint64: any) => boolean;
}
