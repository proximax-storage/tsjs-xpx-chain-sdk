/**
 * @module transactions/ChainUpgradeTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import ChainUpgradeTransactionBufferPackage from '../buffers/ChainUpgradeTransactionBuffer';
import ChainUpgradeTransactionSchema from '../schemas/ChainUpgradeTransactionSchema';
import AccountRestrictionsMosaicModificationTransactionSchema from '../schemas/AccountRestrictionsMosaicModificationTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    CatapultUpgradeTransactionBuffer,
} = ChainUpgradeTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';

export default class ChainUpgradeTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ChainUpgradeTransactionSchema);
    }
}

export class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;

    constructor() {
        this.maxFee = [0, 0];
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }

    addVersion(version) {
        this.version = version;
        return this;
    }

    addType(type) {
        this.type = type;
        return this;
    }

    addDeadline(deadline) {
        this.deadline = deadline;
        return this;
    }

    build() {
        throw new Error("Not implemented yet.");
        const builder = new flatbuffers.Builder(1);


        const bytes = builder.asUint8Array();
        return new ChainUpgradeTransaction(bytes);
    }
}