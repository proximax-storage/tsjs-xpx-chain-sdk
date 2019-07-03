"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Metadata_1 = require("./Metadata");
/* Metadata specialization for address/account */
class AddressMetadata extends Metadata_1.Metadata {
    /**
     * Constructor
     * @param metadataId
     * @param metadataType
     * @param fields
     */
    constructor(
    /* id of the address/account this metadata is associated with */
    metadataId, 
    /* metadata type */
    metadataType, 
    /* metadata key/value array */
    fields) {
        super(metadataType, fields);
        this.metadataId = metadataId;
        this.metadataType = metadataType;
        this.fields = fields;
    }
}
exports.AddressMetadata = AddressMetadata;
//# sourceMappingURL=AddressMetadata.js.map