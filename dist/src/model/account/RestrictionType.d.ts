/**
 * Account restriction type
 * 0x01	The restriction type is an address.
 * 0x02	The restriction type is mosaic id.
 * 0x03	The restriction type is a transaction type.
 * 0x04	restriction type sentinel.
 * 0x80 + type	The restriction is interpreted as a blocking operation.
 */
export declare enum RestrictionType {
    AllowAddress = 1,
    AllowMosaic = 2,
    AllowTransaction = 4,
    Sentinel = 5,
    BlockAddress = 129,
    BlockMosaic = 130,
    BlockTransaction = 132
}
