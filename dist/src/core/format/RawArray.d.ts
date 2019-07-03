export declare class RawArray {
    /**
     * Creates a Uint8Array view on top of input.
     * @param {ArrayBuffer|Uint8Array} input The input array.
     * @returns {Uint8Array} A Uint8Array view on top of input.
     */
    static uint8View: (input: any) => any;
    /**
     * Copies elements from a source array to a destination array.
     * @param {Array} dest The destination array.
     * @param {Array} src The source array.
     * @param {number} [numElementsToCopy=undefined] The number of elements to copy.
     * @param {number} [destOffset=0] The first index of the destination to write.
     * @param {number} [srcOffset=0] The first index of the source to read.
     */
    static copy: (dest: any, src: any, numElementsToCopy?: any, destOffset?: number, srcOffset?: number) => void;
    /**
     * Determines whether or not an array is zero-filled.
     * @param {Array} array The array to check.
     * @returns {boolean} true if the array is zero-filled, false otherwise.
     */
    static isZeroFilled: (array: any) => any;
    /**
     * Deeply checks the equality of two arrays.
     * @param {Array} lhs First array to compare.
     * @param {Array} rhs Second array to compare.
     * @param {number} [numElementsToCompare=undefined] The number of elements to compare.
     * @returns {boolean} true if all compared elements are equal, false otherwise.
     */
    static deepEqual: (lhs: any, rhs: any, numElementsToCompare?: any) => boolean;
}
