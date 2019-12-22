/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Builder } from '../../infrastructure/builders/SecretProofTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { HashType, HashTypeLengthValidator } from './HashType';
import { Transaction, TransactionBuilder } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { calculateFee } from './FeeCalculationStrategy';

export class SecretProofTransaction extends Transaction {

    /**
     * Create a secret proof transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The seed proof hashed.
     * @param recipient - UnresolvedAddress
     * @param proof - The seed proof.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     *
     * @return a SecretProofTransaction instance
     */
    public static create(deadline: Deadline,
                         hashType: HashType,
                         secret: string,
                         recipient: Address,
                         proof: string,
                         networkType: NetworkType,
                         maxFee?: UInt64): SecretProofTransaction {
        return new SecretProofTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .hashType(hashType)
            .secret(secret)
            .recipient(recipient)
            .proof(proof)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param hashType
     * @param secret
     * @param recipient
     * @param proof
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly hashType: HashType,
                public readonly secret: string,
                public readonly recipient: Address,
                public readonly proof: string,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.SECRET_PROOF, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        if (!HashTypeLengthValidator(hashType, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a SecretProofTransaction
     * @returns {number}
     * @memberof SecretProofTransaction
     */
    public get size(): number {
        return SecretProofTransaction.calculateSize(this.proof);
    }

    public static calculateSize(proof: string): number {
        const byteSize = Transaction.getHeaderSize();

        // hash algorithm and proof size static byte size
        const byteAlgorithm = 1;
        const byteProofSize = 2;
        const byteRecipient = 25;
        const secretLength = 32;
        // get proof byte size
        const proofLength = proof.length/2 ;

        return byteSize + byteAlgorithm + secretLength + byteRecipient + byteProofSize + proofLength;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof SecretProofTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                hashAlgorithm: this.hashType,
                secret: this.secret,
                recipient: this.recipient.toDTO(),
                proof: this.proof,
            }
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addSize(this.size)
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addHashAlgorithm(this.hashType)
            .addSecret(this.secret)
            .addRecipient(this.recipient.plain())
            .addProof(this.proof)
            .build();
    }
}

export class SecretProofTransactionBuilder extends TransactionBuilder {
    private _hashType: HashType;
    private _secret: string;
    private _recipient: Address;
    private _proof: string;

    public hashType(hashType: HashType) {
        this._hashType = hashType;
        return this;
    }

    public secret(secret: string) {
        this._secret = secret;
        return this;
    }

    public recipient(recipient: Address) {
        this._recipient = recipient;
        return this;
    }

    public proof(proof: string) {
        this._proof = proof;
        return this;
    }

    public build(): SecretProofTransaction {
        return new SecretProofTransaction(
            this._networkType,
            this._version || TransactionVersion.SECRET_PROOF,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(SecretProofTransaction.calculateSize(this._proof), this._feeCalculationStrategy),
            this._hashType,
            this._secret,
            this._recipient,
            this._proof,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
