declare const ValidateTransaction: {
    validateStandaloneTx: (transaction: any, transactionDTO: any) => void;
    validateAggregateTx: (aggregateTransaction: any, aggregateTransactionDTO: any) => void;
    validateMosaicCreationTx: (mosaicDefinitionTransaction: any, mosaicDefinitionTransactionDTO: any) => void;
    validateMosaicSupplyChangeTx: (mosaicSupplyChangeTransaction: any, mosaicSupplyChangeTransactionDTO: any) => void;
    validateMultisigModificationTx: (modifyMultisigAccountTransaction: any, modifyMultisigAccountTransactionDTO: any) => void;
    validateNamespaceCreationTx: (registerNamespaceTransaction: any, registerNamespaceTransactionDTO: any) => void;
    validateTransferTx: (transferTransaction: any, transferTransactionDTO: any) => void;
};
export default ValidateTransaction;
