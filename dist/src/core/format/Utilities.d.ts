export declare const createBuilder: () => {
    map: {};
    /**
     * Adds a range mapping to the map.
     * @param {string} start The start character.
     * @param {string} end The end character.
     * @param {number} base The value corresponding to the start character.
     * @memberof module:utils/charMapping~CharacterMapBuilder
     * @instance
     */
    addRange: (start: any, end: any, base: any) => void;
};
export declare const Nibble_To_Char_Map: string[];
export declare const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export declare const Decoded_Block_Size = 5;
export declare const Encoded_Block_Size = 8;
export declare const tryParseByte: (char1: any, char2: any) => number | undefined;
/**
 * Tries to parse a string representing an unsigned integer.
 * @param {string} str The string to parse.
 * @returns {number} The number represented by the input or undefined.
 */
export declare const tryParseUint: (str: any) => number | undefined;
export declare const idGeneratorConst: {
    namespace_base_id: number[];
    namespace_max_depth: number;
    name_pattern: RegExp;
};
export declare const throwInvalidFqn: (reason: any, name: any) => never;
export declare const extractPartName: (name: any, start: any, size: any) => any;
export declare const append: (path: any, id: any, name: any) => void;
export declare const split: (name: any, processor: any) => number;
export declare const generateNamespaceId: (parentId: any, name: any) => number[];
export declare const encodeBlock: (input: any, inputOffset: any, output: any, outputOffset: any) => void;
export declare const Char_To_Decoded_Char_Map: () => any;
export declare const decodeChar: (c: any) => any;
export declare const decodeBlock: (input: any, inputOffset: any, output: any, outputOffset: any) => void;
