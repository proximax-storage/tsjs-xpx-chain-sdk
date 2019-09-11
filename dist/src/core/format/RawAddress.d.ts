import { SignSchema } from '../crypto';
export declare class RawAddress {
    static readonly constants: {
        sizes: {
            ripemd160: number;
            addressDecoded: number;
            addressEncoded: number;
            key: number;
            checksum: number;
        };
    };
    /**
     * Converts an encoded address string to a decoded address.
     * @param {string} encoded The encoded address string.
     * @returns {Uint8Array} The decoded address corresponding to the input.
     */
    static stringToAddress: (encoded: string) => Uint8Array;
    /**
     * Format a namespaceId *alias* into a valid recipient field value.
     * @param {Uint8Array} namespaceId The namespaceId
     * @returns {Uint8Array} The padded notation of the alias
     */
    static aliasToRecipient: (namespaceId: Uint8Array) => Uint8Array;
    /**
     * Converts a decoded address to an encoded address string.
     * @param {Uint8Array} decoded The decoded address.
     * @returns {string} The encoded address string corresponding to the input.
     */
    static addressToString: (decoded: Uint8Array) => string;
    /**
     * Converts a public key to a decoded address for a specific network.
     * @param {Uint8Array} publicKey The public key.
     * @param {number} networkIdentifier The network identifier.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {Uint8Array} The decoded address corresponding to the inputs.
     */
    static publicKeyToAddress: (publicKey: Uint8Array, networkIdentifier: number, signSchema?: SignSchema) => Uint8Array;
    /**
     * Determines the validity of a decoded address.
     * @param {Uint8Array} decoded The decoded address.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {boolean} true if the decoded address is valid, false otherwise.
     */
    static isValidAddress: (decoded: Uint8Array, signSchema?: SignSchema) => boolean;
    /**
     * Determines the validity of an encoded address string.
     * @param {string} encoded The encoded address string.
     * @returns {boolean} true if the encoded address string is valid, false otherwise.
     */
    static isValidEncodedAddress: (encoded: string) => boolean;
}
