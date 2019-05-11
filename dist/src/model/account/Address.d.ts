import { NetworkType } from '../blockchain/NetworkType';
/**
 * The address structure describes an address with its network
 */
export declare class Address {
    private readonly address;
    /**
     * The NEM network type.
     */
    readonly networkType: NetworkType;
    /**
     * Create from private key
     * @param publicKey - The account public key.
     * @param networkType - The NEM network type.
     * @returns {Address}
     */
    static createFromPublicKey(publicKey: string, networkType: NetworkType): Address;
    /**
     * Create an Address from a given raw address.
     * @param rawAddress - Address in string format.
     *                  ex: SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3 or SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3
     * @returns {Address}
     */
    static createFromRawAddress(rawAddress: string): Address;
    /**
     * @internal
     * Create an Address from a given encoded address.
     * @param {string} encoded
     * @return {Address}
     */
    static createFromEncoded(encoded: string): Address;
    /**
     * @internal
     * @param address
     * @param networkType
     */
    private constructor();
    /**
     * Get address in plain format ex: SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3.
     * @returns {string}
     */
    plain(): string;
    /**
     * Get address in pretty format ex: SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3.
     * @returns {string}
     */
    pretty(): string;
    /**
     * Compares addresses for equality
     * @param address - Address
     * @returns {boolean}
     */
    equals(address: Address): boolean;
    /**
     * Create DTO object
     */
    toDTO(): {
        address: string;
        networkType: NetworkType;
    };
}
