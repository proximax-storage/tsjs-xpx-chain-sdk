/**
 * In bytes
 * @type {{BYTE: number, SHORT: number, INT: number}}
 */
export declare const TypeSize: {
    BYTE: number;
    SHORT: number;
    INT: number;
};
/**
 * @param {string} name Attribute name
 * @returns {ScalarAttribute} return ScalarAttribute Instance
 */
export declare const ubyte: (name: any) => ScalarAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export declare const byte: (name: any) => ScalarAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export declare const ushort: (name: any) => ScalarAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export declare const short: (name: any) => ScalarAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export declare const uint: (name: any) => ScalarAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export declare const int: (name: any) => ScalarAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @param {number} typeSize Attribute Byte Size
 * @returns {ArrayAttribute} ArrayAttribute Instance
 */
export declare const array: (name: any, typeSize?: number) => ArrayAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @returns {ArrayAttribute} ArrayAttribute Instance
 */
export declare const string: (name: any) => ArrayAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @param {module:schema/Schema} schema Table Specific Schema definition
 * @returns {TableAttribute} TableAttribute Instance
 */
export declare const table: (name: any, schema: any) => TableAttribute;
/**
 *
 * @param {string} name Attribute Name
 * @param {module:schema/Schema} schema Schema Definition
 * @returns {TableArrayAttribute} TableAttribute Instance
 */
export declare const tableArray: (name: any, schema: any) => TableArrayAttribute;
/**
 * Schema
 * @module schema/Schema
 */
export declare class Schema {
    schemaDefinition: any;
    /**
     * @constructor
     * @param {Array.<Attribute>} schemaDefinition Schema Definition
     */
    constructor(schemaDefinition: any);
    /**
     *
     * @param {Uint8Array} bytes flatbuffers bytes
     * @returns {Uint8Array} catapult buffer
     */
    serialize(bytes: any): never[];
    /**
     * @param {Uint8Array} bytes flatbuffer bytes
     * @returns {Array} Array with field name + payload
     */
    debugSerialize(bytes: any): any;
}
export declare class Attribute {
    name: any;
    /**
     * @constructor
     * @param {string} name schema attribute name
     */
    constructor(name: any);
    /**
     *
     * @param {Uint8Array} buffer flatbuffer bytes
     * @param {number} position attribute possition in flatbuffer bytes
     * @param {number} val0 position in case that it is an inner object
     */
    serialize(buffer: any, position: any, val0?: undefined): void;
    /**
     * @suppress warnings
     * @param {Uint8Array} buffer buffer flatbuffer bytes
     * @param {number} position attribute possition in flatbuffer bytes
     * @param {number} val0 position in case that it is an inner object
     */
    debugSerialize(buffer: any, position: any, val0?: undefined): void;
}
export declare class ScalarAttribute extends Attribute {
    typeSize: any;
    name: any;
    /**
     * @constructor
     * @param {string} name schema attribute name
     * @param {number} typeSize
     */
    constructor(name: any, typeSize: any);
    serialize(buffer: any, position: any, val0?: undefined): any;
    debugSerialize(buffer: any, position: any, val0?: undefined): {
        name: any;
        bytes: any;
    };
}
export declare class ArrayAttribute extends Attribute {
    typeSize: any;
    name: any;
    /**
     * @constructor
     * @param name - {string}
     * @param typeSize - {TypeSize}
     */
    constructor(name: any, typeSize: any);
    serialize(buffer: any, position: any, val0?: undefined): any;
    debugSerialize(buffer: any, position: any, val0?: undefined): {
        name: any;
        bytes: any;
    };
}
export declare class TableAttribute extends Attribute {
    schema: any;
    name: any;
    /**
     *
     * @param {string} name
     * @param {module:schema/Schema} schema
     */
    constructor(name: any, schema: any);
    serialize(bytes: any, position: any, val0?: undefined): never[];
    debugSerialize(buffer: any, position: any, val0?: undefined): {
        name: any;
        bytes: never[];
    };
}
export declare class TableArrayAttribute extends Attribute {
    schema: any;
    name: any;
    /**
     * @constructor
     * @param {string} name
     * @param {module:schema/Schema} schema
     */
    constructor(name: any, schema: any);
    serialize(bytes: any, position: any, val0?: undefined): never[];
    debugSerialize(buffer: any, position: any, val0?: undefined): {
        name: any;
        bytes: never[];
    };
}
