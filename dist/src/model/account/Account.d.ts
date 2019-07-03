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
     * Create an Account from a given private key
     * @param privateKey - Private key from an account
     * @param networkType - Network type
     * @return {Account}
     */
    static createFromPrivateKey(privateKey: string, networkType: NetworkType): Account;
    static generateNewAccount(networkType: NetworkType): Account;
    /**
     * Create a new encrypted Message
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @returns {EncryptedMessage}
     */
    encryptMessage(message: string, recipientPublicAccount: PublicAccount): EncryptedMessage;
    /**
     * Decrypts an encrypted message
     * @param encryptedMessage - Encrypted message
     * @param publicAccount - The public account originally encrypted the message
     * @returns {PlainMessage}
     */
    decryptMessage(encryptedMessage: EncryptedMessage, publicAccount: PublicAccount): PlainMessage;
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
     * @return {SignedTransaction}
     */
    sign(transaction: Transaction, generationHash: any): SignedTransaction;
    /**
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param transaction - The aggregate transaction to be signed.
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    signTransactionWithCosignatories(transaction: AggregateTransaction, cosignatories: Account[], generationHash: string): SignedTransaction;
    /**
     * Sign aggregate signature transaction
     * @param cosignatureTransaction - The aggregate signature transaction.
     * @return {CosignatureSignedTransaction}
     */
    signCosignatureTransaction(cosignatureTransaction: CosignatureTransaction): CosignatureSignedTransaction;
    /**
     * Sign raw data
     * @param data - Data to be signed
     * @return {string} - Signed data result
     */
    signData(data: string): string;
}
