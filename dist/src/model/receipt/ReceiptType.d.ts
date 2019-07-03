/**
 * Receipt type enums.
 *
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.h
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.cpp
 */
export declare enum ReceiptType {
    /**
     * The recipient, account and amount of fees received for harvesting a block. It is recorded when a block is harvested.
     */
    Harvest_Fee = 8515,
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid address alias instead of an address.
     */
    Address_Alias_Resolution = 61763,
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid mosaic alias instead of a mosaicId.
     */
    Mosaic_Alias_Resolution = 62019,
    /**
     * A collection of state changes for a given source. It is recorded when a state change receipt is issued.
     */
    Transaction_Group = 57667,
    /**
     * The mosaicId expiring in this block. It is recorded when a mosaic expires.
     */
    Mosaic_Expired = 16717,
    /**
     * The sender and recipient of the levied mosaic, the mosaicId and amount. It is recorded when a transaction has a levied mosaic.
     */
    Mosaic_Levy = 4685,
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of registering the mosaic.
     * It is recorded when a mosaic is registered.
     */
    Mosaic_Rental_Fee = 4941,
    /**
     * The namespaceId expiring in this block. It is recorded when a namespace expires.
     */
    Namespace_Expired = 16718,
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of extending the namespace.
     * It is recorded when a namespace is registered or its duration is extended.
     */
    Namespace_Rental_Fee = 4686,
    /**
     * The lockhash sender, mosaicId and amount locked. It is recorded when a valid HashLockTransaction is announced.
     */
    LockHash_Created = 12616,
    /**
     * The haslock sender, mosaicId and amount locked that is returned.
     * It is recorded when an aggregate bonded transaction linked to the hash completes.
     */
    LockHash_Completed = 8776,
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a lock hash expires.
     */
    LockHash_Expired = 9032,
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a valid SecretLockTransaction is announced.
     */
    LockSecret_Created = 12626,
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a secretlock is proved.
     */
    LockSecret_Completed = 8786,
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a secretlock expires
     */
    LockSecret_Expired = 9042,
    /**
     * The amount of native currency mosaics created. The receipt is recorded when the network has inflation configured,
     * and a new block triggers the creation of currency mosaics.
     */
    Inflation = 20803
}
