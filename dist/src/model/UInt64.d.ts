/**
 * UInt64 data model
 */
export declare class UInt64 {
    /**
     * uint64 lower part
     */
    readonly lower: number;
    /**
     * uint64 higher part
     */
    readonly higher: number;
    /**
     * Create from uint value
     * @param value
     * @returns {UInt64}
     */
    static fromUint(value: number): UInt64;
    /**
     * Parses a hex string into a UInt64.
     * @param {string} input A hex encoded string.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    static fromHex(input: string): UInt64;
    /**
     * Constructor
     * @param uintArray
     */
    constructor(uintArray: number[]);
    /**
     * Get hexadecimal representation
     *
     * @return {string}
     */
    toHex(): string;
    /**
     * Compact higher and lower uint parts into a uint
     * @returns {number}
     */
    compact(): number;
    /**
     * Compares for equality
     * @param other
     * @returns {boolean}
     */
    equals(other: UInt64): boolean;
}
