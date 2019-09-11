export declare enum HashType {
    Op_Sha3_256 = 0,
    Op_Keccak_256 = 1,
    Op_Hash_160 = 2,
    Op_Hash_256 = 3
}
export declare function HashTypeLengthValidator(hashType: HashType, input: string): boolean;
