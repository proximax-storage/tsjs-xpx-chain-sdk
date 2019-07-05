import { SignSchema } from '../../core/crypto';
import { NetworkType } from '../blockchain/NetworkType';
import { AggregateTransaction } from '../transaction/AggregateTransaction';
import { CosignatureSignedTransaction } from '../transaction/CosignatureSignedTransaction';
import { CosignatureTransaction } from '../transaction/CosignatureTransaction';
import { EncryptedMessage } from '../transaction/EncryptedMessage';
import { PlainMessage } from '../transaction/PlainMessage';
import { SignedTransaction } from '../transaction/SignedTransaction';
import { Transaction } from '../transaction/Transaction';
import { Address } from './Address';
import { PublicAccount } from './PublicAccount';
/**
 * The account structure describes an account private key, public key, address and allows signing transactions.
 */
export declare class Account {
    /**
     * The account address.
     */
    readonly address: Address;
    /**
     * The account keyPair, public and private key.
     */
    private readonly keyPair;
    /**
     * The Sign Schema (KECCAK_REVERSED_KEY / SHA3).
     */
    private readonly signSchema;
    /**
     * Create an Account from a given private key
     * @param privateKey - Private key from an account
     * @param networkType - Network type
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {Account}
     */
    static createFromPrivateKey(privateKey: string, networkType: NetworkType, signSchema?: SignSchema): Account;
    /**
     * Generate a new account
     * @param networkType - Network type
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     */
    static generateNewAccount(networkType: NetworkType, signSchema?: SignSchema): Account;
    /**
     * Create a new encrypted Message
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {EncryptedMessage}
     */
    encryptMessage(message: string, recipientPublicAccount: PublicAccount, signSchema?: SignSchema): EncryptedMessage;
    /**
     * Decrypts an encrypted message
     * @param encryptedMessage - Encrypted message
     * @param publicAccount - The public account originally encrypted the message
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {PlainMessage}
     */
    decryptMessage(encryptedMessage: EncryptedMessage, publicAccount: PublicAccount, signSchema?: SignSchema): PlainMessage;
    /**
     * Account public key.
     * @return {string}
     */
    readonly publicKey: string;
    /**
     * Public account.
     * @return {PublicAccount}
     */
    readonly publicAccount: PublicAccount;
    /**
     * Account private key.
     * @return {string}
     */
    readonly privateKey: string;
    /**
     * Sign a transaction
     * @param transaction - The transaction to be signed.
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {SignedTransaction}
     */
    sign(transaction: Transaction, generationHash: any, signSchema?: SignSchema): SignedTransaction;
    /**
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param transaction - The aggregate transaction to be signed.
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {SignedTransaction}
     */
    signTransactionWithCosignatories(transaction: AggregateTransaction, cosignatories: Account[], generationHash: string, signSchema?: SignSchema): SignedTransaction;
    /**
     * Sign aggregate signature transaction
     * @param cosignatureTransaction - The aggregate signature transaction.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {CosignatureSignedTransaction}
     */
    signCosignatureTransaction(cosignatureTransaction: CosignatureTransaction, signSchema?: SignSchema): CosignatureSignedTransaction;
    /**
     * Sign raw data
     * @param data - Data to be signed
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {string} - Signed data result
     */
    signData(data: string, signSchema?: SignSchema): string;
}
