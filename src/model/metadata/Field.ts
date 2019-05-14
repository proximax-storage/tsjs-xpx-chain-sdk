/**
 * Key value storage for metadata fields
 */
export class Field {
    /**
     * Constructor
     * @param key 
     * @param value 
     */
    constructor(
        public readonly key: string,

        public readonly value: string
    ) {

    }
}