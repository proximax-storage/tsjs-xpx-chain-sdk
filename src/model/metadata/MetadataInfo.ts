import { Metadata } from "./Metadata";

/**
 * Wrapper around Metadata class as returned from rest api
 */
export class MetadataInfo {
    constructor(
        public readonly metadata: Metadata
    ) {
        
    }
}