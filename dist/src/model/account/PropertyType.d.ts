/**
 * Account property type
 * 0x01	The property type is an address.
 * 0x02	The property type is mosaic id.
 * 0x03	The property type is a transaction type.
 * 0x04	Property type sentinel.
 * 0x80 + type	The property is interpreted as a blocking operation.
 */
export declare enum PropertyType {
    AllowAddress = 1,
    AllowMosaic = 2,
    AllowTransaction = 4,
    Sentinel = 5,
    BlockAddress = 129,
    BlockMosaic = 130,
    BlockTransaction = 132
}
