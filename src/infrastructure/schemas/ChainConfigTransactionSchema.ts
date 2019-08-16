import {
    array,
    Schema,
    table,
    tableArray,
    TypeSize,
    ubyte,
    uint,
    ushort
} from './Schema';

/**
 * @module schema/ChainConfigTransactionSchema
 */

/**
 * Chain configuration transaction schema
 * @const {module:schema/Schema}
 */
const schema = new Schema([
    uint('size'),
    array('signature'),
    array('signer'),
    uint('version'),
    ushort('type'),
    array('fee', TypeSize.INT),
    array('deadline', TypeSize.INT),
]);

export default schema;
