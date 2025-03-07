import {
    Mosaic, MosaicId, MosaicNonce, MosaicProperties, MosaicSupplyType, 
    Account, PublicAccount, UInt64, Deadline,
    NamespaceId,
    MultisigAccountGraphInfo,
    SignedTransaction,
    TransactionGroupType, TransactionStatus,
    MetadataType
} from '../model/model';
import {TransactionBuilderFactory} from '../model/transaction/TransactionBuilderFactory';
import { Convert } from '../core/format';
import { 
    TransactionHttp, MosaicHttp, NetworkHttp, 
    ChainHttp, ChainConfigHttp, 
    AccountHttp, NodeHttp, MetadataHttp, MetadataQueryParams
} from '../infrastructure/infrastructure';
import { firstValueFrom } from "rxjs";
import { 
    checkCosigner,
    parseConfig, getConfigSetting,
    TimeUnit,
    getABTMaxSafeDurationWithSeconds,
    getABTMaxSafeDeadlineWithSeconds,
    genMetadataCompositeHash
} from "../model/transaction/Utilities";

interface INftMetadata{
    name: string,
    description: string,
    imgUrl: string,
    attributes: object,
    tags: string[],
    collectionAssetId?: string,
    collectionName?: string,
    collectionId?: string,
    type: 'nft'
}

interface INftInfo{
    metadata: INftMetadata | string,
    creator: string,
    creatorAddress: string,
}

interface INftEntry{
    assetId: string,
    data: INftInfo
}

export class NftService {

    networkType: number = 0;
    maxDurationBlock: number = 0;
    maxBondedTransactionLifetimeInSec: number = 0;
    nftScopeKey: UInt64 = UInt64.fromHex(Convert.utf8ToHex('nft.json'));
    networkHttp: NetworkHttp;

    constructor(
        private txnBuilder:TransactionBuilderFactory, 
        private bcApiUrl: string){
            this.networkHttp = new NetworkHttp(bcApiUrl);
        }

    async getNftByCreatorPublicKey(creatorPublicKey: string, assetId: UInt64 | MosaicId){
        let compositeHash = genMetadataCompositeHash(
            PublicAccount.createFromPublicKey(creatorPublicKey, this.networkType), 
            this.nftScopeKey,
            MetadataType.MOSAIC,
            assetId
        );

        let assetIdObj: MosaicId;

        if(assetId instanceof UInt64){
            assetIdObj = new MosaicId(assetId.toHex());
        }
        else{
            assetIdObj = assetId;
        }

        let metadata = "";
        let currentOwner = "";
        let currentOwnerAddress = "";

        try {
            const metadataHttp = new MetadataHttp(this.bcApiUrl, this.networkHttp);
            const assetHttp = new MosaicHttp(this.bcApiUrl, this.networkHttp);

            let metadataEntry = await firstValueFrom(metadataHttp.getMetadata(compositeHash));
            let assetRichlist = await firstValueFrom(assetHttp.getMosaicRichlist(assetIdObj));

            metadata = metadataEntry.value;

            currentOwner = assetRichlist[0].publicKey;
            currentOwnerAddress = assetRichlist[0].address.pretty();
        } catch (error) {
            throw new Error("NFT data not found");
        }

        try {
            return {
                metadata: JSON.parse(metadata),
                currentOwner: currentOwner,
                currentOwnerAddress: currentOwnerAddress
            }
        } catch (error) {
            return {
                metadata: JSON.parse(metadata),
                currentOwner: currentOwner,
                currentOwnerAddress: currentOwnerAddress
            }
        }
    }

    async getNftList(filters: { 
        creatorPublicKey?: string,
        pageSize?: number,
        pageNumber?: number
     }){
        const metadataHttp = new MetadataHttp(this.bcApiUrl, this.networkHttp);

        let metadataQP = new MetadataQueryParams();
        metadataQP.metadataType = MetadataType.MOSAIC;
        metadataQP.scopedMetadataKey = this.nftScopeKey;

        if(filters.creatorPublicKey){
            metadataQP.targetKey = filters.creatorPublicKey;
        }

        if(filters.pageSize){
            metadataQP.pageSize = filters.pageSize;
        }

        if(filters.pageNumber){
            metadataQP.pageNumber = filters.pageNumber;
        }
        
        try {
            const metadataSearch = await firstValueFrom(metadataHttp.searchMetadata(metadataQP));

            return metadataSearch;
        } catch (error) {
            throw new Error("Error retrieving NFT entry");
        }
    }

    async getNftByOwner(ownerPublicKey: string, part: number = 1, chunkSize: number = 50){

        const accountHttp = new AccountHttp(this.bcApiUrl, this.networkHttp);
        const publicAcc = PublicAccount.createFromPublicKey(ownerPublicKey, await this.getNetwork());

        try {
            const accInfo = await firstValueFrom(accountHttp.getAccountInfo(publicAcc.address));

            let nftCandidates: MosaicId[] = [];

            for(const asset of accInfo.mosaics){
                
                if(asset.amount.toBigInt() > BigInt(1)){
                    continue;
                }

                nftCandidates.push(asset.id);
            }

            let chunkedNftCandidates = nftCandidates.slice((part - 1) * chunkSize, part * chunkSize);
            let nftInfo = await this.findNft(chunkedNftCandidates);

            return nftInfo;
        } catch (error) {
            throw new Error("Error retrieving NFT entry");
        }
    }

    async findNft(nftCandidates: MosaicId[]){

        let nfts: INftEntry[] = [];
        let assetHttp = new MosaicHttp(this.bcApiUrl, this.networkHttp);

        if(nftCandidates.length > 80){
            throw new Error("SDAs to check are greater than recommended size, maximum are 80");
        }

        let assetsInfo = await firstValueFrom(assetHttp.getMosaics(nftCandidates));

        await this.getNetwork();

        let nftAssets = assetsInfo.filter(x => !x.isSupplyMutable() && x.divisibility === 0)
                                    .map(x=> { return { 
                                        assetId: x.mosaicId,
                                        compositeHash: genMetadataCompositeHash(
                                            PublicAccount.createFromPublicKey(x.owner.publicKey, this.networkType), 
                                            this.nftScopeKey, MetadataType.MOSAIC, x.mosaicId)
                                        }
                                    });

        let metadataHttp = new MetadataHttp(this.bcApiUrl, this.networkHttp);

        let metadataEntries = await firstValueFrom(metadataHttp.getMetadatas(nftAssets.map(x => x.compositeHash)));

        for(const nftMetadata of metadataEntries){

            let nftData: INftInfo;

            try {
                nftData = {
                    metadata: JSON.parse(nftMetadata.value),
                    creator: nftMetadata.targetKey,
                    creatorAddress: nftMetadata.sourceAddress.pretty()
                }
            } catch (error) {
                nftData = {
                    metadata: nftMetadata.value,
                    creator: nftMetadata.targetKey,
                    creatorAddress: nftMetadata.sourceAddress.pretty()
                }
            }

            nfts.push({ 
                assetId: nftMetadata.targetId.toHex(), 
                data: nftData
            });
        }

        return nfts;
    }

    async getNftData(assetId: string | UInt64 | MosaicId){
        let assetIdObj: MosaicId;

        if(typeof assetId === 'string'){
            assetIdObj = new MosaicId(assetId);
        }
        else if(assetId instanceof UInt64){
            assetIdObj = new MosaicId(assetId.toHex());
        }
        else{
            assetIdObj = assetId;
        }

        const metadataHttp = new MetadataHttp(this.bcApiUrl, this.networkHttp);
        const assetHttp = new MosaicHttp(this.bcApiUrl, this.networkHttp);

        let metadata: string = "";
        let creator: string = "";
        let creatorAddress: string = "";
        let currentOwner: string = "";
        let currentOwnerAddress: string = "";

        try {
            let metadataQP = new MetadataQueryParams();
            metadataQP.targetId = assetIdObj;
            metadataQP.metadataType = MetadataType.MOSAIC;
            metadataQP.scopedMetadataKey = this.nftScopeKey;

            let metadataSearch = await firstValueFrom(metadataHttp.searchMetadata(metadataQP));
            let assetRichlist = await firstValueFrom(assetHttp.getMosaicRichlist(assetIdObj));

            if(metadataSearch.metadataEntries.length === 0){
                // throw new Error("No metadata found");
                return null;
            }

            metadata = metadataSearch.metadataEntries[0].value;
            creator = metadataSearch.metadataEntries[0].targetKey;
            creatorAddress = metadataSearch.metadataEntries[0].sourceAddress.pretty();
            currentOwner = assetRichlist[0].publicKey;
            currentOwnerAddress = assetRichlist[0].address.pretty();
        } catch (error) {
            throw new Error("Failed to get NFT metadata");   
        }

        try {
            return {
                metadata: JSON.parse(metadata),
                creator: creator,
                creatorAddress: creatorAddress,
                currentOwner: currentOwner,
                currentOwnerAddress: currentOwnerAddress
            };
        } catch (error) {
            return {
                metadata: metadata,
                creator: creator,
                creatorAddress: creatorAddress,
                currentOwner: currentOwner,
                currentOwnerAddress: currentOwnerAddress
            };
        }
    }

    async createAndAnnounce(owner: Account, 
        metadata: INftMetadata
    ){
        let signedTxn = await this.createSigned(owner, metadata);

        let txnHttp = new TransactionHttp(this.bcApiUrl);

        try {
            await firstValueFrom(txnHttp.announce(signedTxn.txn));

            return {
                assetId: signedTxn.assetId,
                txnHash: signedTxn.txn.hash
            }
        } catch (error) {
            throw new Error("Failed to announce transaction");   
        }
    }

    async createSigned(owner: Account, 
        metadata: INftMetadata
    ){
        let nftTxn = await this.createUnsigned(owner.publicAccount, metadata);

        let signedTxn = owner.sign(nftTxn.txn, this.txnBuilder.generationHash);

        return {
            assetId: nftTxn.assetId,
            txn: signedTxn
        }
    }

    async createUnsigned(owner: PublicAccount, 
        metadata: INftMetadata, deadline?: Deadline, useBonded: boolean = false
    ){
        let aggregateTxn = useBonded ? this.txnBuilder.aggregateBondedV1(): 
                                    this.txnBuilder.aggregateCompleteV1();

        if(deadline){
            aggregateTxn = aggregateTxn.deadline(deadline);
        }


        let mosaicNonce = MosaicNonce.createRandom();

        let mosaicId = MosaicId.createFromNonce(mosaicNonce, owner);
        let assetId = mosaicId.toHex();
        
        let assetCheckPassed = false;

        const assetHttp = new MosaicHttp(this.bcApiUrl, this.networkHttp);
        
        while(!assetCheckPassed){
            try {
                let mosaicInfo = await firstValueFrom(assetHttp.getMosaic(mosaicId));
                
                mosaicId = MosaicId.createFromNonce(mosaicNonce, owner);
                assetId = mosaicId.toHex();
            } catch (error) {
                assetCheckPassed = true;
            }
        }

        // const ipfsCid = await this.uploadIPFS(uploadedFile);

        // create mosaic
        const assetDefinitionTxn = this.txnBuilder.mosaicDefinition()
                                    .mosaicNonce(mosaicNonce)
                                    .mosaicId(mosaicId)
                                    .mosaicProperties(MosaicProperties.create({
                                        divisibility:0,
                                        supplyMutable: false,
                                        transferable: true,
                                    }))
                                    .build();

        // set supply
        const assetSupplyChangeTxn = this.txnBuilder.mosaicSupplyChange()
                                    .direction(MosaicSupplyType.Increase)
                                    .delta(UInt64.fromUint(1))
                                    .mosaicId(mosaicId)
                                    .build();

        if(Convert.hexToUint8(Convert.utf8ToHex(JSON.stringify(metadata))).length > 1024){
            throw new Error("Invalid size of metadata, maximum size of 1024");
        }

        // set meta data
        const assetMetadataTxn = this.txnBuilder.mosaicMetadata()
                            .oldValue("")
                            .value(JSON.stringify(metadata))
                            .scopedMetadataKey(this.nftScopeKey)
                            .targetMosaicId(mosaicId)
                            .targetPublicKey(owner)
                            .calculateDifferences()
                            .build();

        const innerTxn = [
            assetDefinitionTxn.toAggregateV1(owner),
            assetSupplyChangeTxn.toAggregateV1(owner),
            assetMetadataTxn.toAggregateV1(owner),
        ];

        return {
            assetId: assetId,
            txn: aggregateTxn.innerTransactions(innerTxn).build()
        };
    }

    async creteMultisigNftAnnounce(myAcc: Account, multisigAcc: PublicAccount | string, 
        metadata: INftMetadata, nativeCurrency?: NamespaceId | MosaicId){

        let resultTxn = await this.createMultisigNFTPayload(myAcc, multisigAcc, metadata, nativeCurrency);

        let txnHttp = new TransactionHttp(this.bcApiUrl);
        let chainHttp = new ChainHttp(this.bcApiUrl);

        if(resultTxn.hashLockTxn){
            try {
                await firstValueFrom(txnHttp.announce(resultTxn.hashLockTxn));
            } catch (error) {
                throw new Error("Failed to announce transaction");   
            }

            let hashLockConfirmed = false;
            let confirmationBlock = BigInt(0);
            let attemptCount = 0;

            while(!hashLockConfirmed){
                // wait 5 seconds
                await new Promise(resolve => setTimeout(resolve, 5000));
                attemptCount++;

                let hashLockTxnStatus: TransactionStatus | null = null;
                
                try {    

                    hashLockTxnStatus = await firstValueFrom(txnHttp.getTransactionStatus(resultTxn.hashLockTxn.hash));
                } catch (error) {
                     
                }

                if(hashLockTxnStatus){
                    if(hashLockTxnStatus.group === TransactionGroupType.CONFIRMED){
                        hashLockConfirmed = true;
                        confirmationBlock = hashLockTxnStatus.height!.toBigInt();
                        break;
                    }
                    else if(hashLockTxnStatus.group === TransactionGroupType.FAILED){
                        throw new Error("HashLock transaction failed");
                    }
                }

                if(attemptCount > 5){
                    throw new Error("HashLock transaction not confirmed");
                }
            }

            attemptCount = 0;
            let abtAnnounced = false;

            while(!abtAnnounced){
                await new Promise(resolve => setTimeout(resolve, 5000));
                attemptCount++;

                let currentBlockHeight: UInt64 | null = null;

                try {    
                    currentBlockHeight = await firstValueFrom(chainHttp.getBlockchainHeight());
                } catch (error) {
                    throw new Error("Unable to check current block height");
                }

                if(currentBlockHeight.toBigInt() > (confirmationBlock + BigInt(1))){
                    await firstValueFrom(txnHttp.announceAggregateBonded(resultTxn.txn));
                    abtAnnounced = true; 
                    break;
                }

                if(attemptCount > 8){
                    throw new Error("Sirius Chain not generating new block");
                }
            }
        }
        else{
            try {
                await firstValueFrom(txnHttp.announce(resultTxn.txn));
            } catch (error) {
                throw new Error("Failed to announce transaction");   
            }
        }

        return {
            assetId: resultTxn.assetId,
            txnHash: resultTxn.txn.hash,
            hashLockTxnHash: resultTxn.hashLockTxn?.hash
        };
    }

    async createMultisigNFTPayload(myAcc: Account, multisigAcc: PublicAccount | string, 
        metadata: INftMetadata, nativeCurrency?: NamespaceId | MosaicId){

        let usingMultisig: PublicAccount;

        if(typeof multisigAcc === 'string'){
            usingMultisig = PublicAccount.createFromPublicKey(multisigAcc, await this.getNetwork(),1);
        }
        else{
            usingMultisig = multisigAcc;
        }

        let networkConfig: string = "";
        let multisigAccGraph: MultisigAccountGraphInfo;

        try {
            const chainConfigHttp = new ChainConfigHttp(this.bcApiUrl);
            const chainHttp = new ChainHttp(this.bcApiUrl);
            const chainHeight = await firstValueFrom(chainHttp.getBlockchainHeight());
            const chainConfig = await firstValueFrom(chainConfigHttp.getChainConfig(Number(chainHeight.toBigInt())));
            networkConfig = chainConfig.networkConfig;
        } catch (error) {
            throw new Error("Unable to get network config");
        }

        try {
            const accountHttp = new AccountHttp(this.bcApiUrl, this.networkHttp);
            const multisigGraphInfo = await firstValueFrom(accountHttp.getMultisigAccountGraphInfo(usingMultisig.address));

            multisigAccGraph = multisigGraphInfo;
        } catch (error) {
            throw new Error("Unable to get multisig account graph info");
        }

        const cosignerCheckResult = checkCosigner(myAcc.publicKey, usingMultisig.publicKey, multisigAccGraph);

        let unsignedResult = await this.createUnsigned(usingMultisig, metadata);
        let signedTxn = myAcc.sign(unsignedResult.txn, this.txnBuilder.generationHash);
        let signedHashLockTxn: SignedTransaction | null = null;
        
        if(!cosignerCheckResult.aggComplete){

            try {
                const nodeHttp = new NodeHttp(this.bcApiUrl);
                const nodeTime = await firstValueFrom(nodeHttp.getNodeTime());
                const nodeTimeStamp = new UInt64(nodeTime.sendTimeStamp!);

                const parsedConfig = parseConfig(networkConfig);
                                
                const maxBondedTransactionLifetime = getConfigSetting(parsedConfig, ["plugin","catapult.plugins.aggregate","maxBondedTransactionLifetime"], TimeUnit.SECOND);
                const maxHashLockDuration = getConfigSetting(parsedConfig, ["plugin","catapult.plugins.lockhash","maxHashLockDuration"], TimeUnit.SECOND);
                const lockedFundsPerAggregate = getConfigSetting(parsedConfig, ["plugin","catapult.plugins.lockhash","lockedFundsPerAggregate"]);
                const blockGenerationTargetTime = getConfigSetting(parsedConfig, ["chain","blockGenerationTargetTime"], TimeUnit.SECOND);

                const abtDeadline = getABTMaxSafeDeadlineWithSeconds(maxBondedTransactionLifetime, maxHashLockDuration, nodeTimeStamp);
                const abtDuration = getABTMaxSafeDurationWithSeconds(blockGenerationTargetTime, maxBondedTransactionLifetime, maxHashLockDuration);

                unsignedResult = await this.createUnsigned(usingMultisig, metadata, abtDeadline, true);
                signedTxn = myAcc.sign(unsignedResult.txn, this.txnBuilder.generationHash);

                let unsignedHashLock = await this.txnBuilder.hashLock()
                                .duration(UInt64.fromUint(abtDuration))
                                .mosaic(new Mosaic(nativeCurrency ?? new NamespaceId("prx.xpx"), UInt64.fromBigInt(BigInt(lockedFundsPerAggregate))))
                                .transactionHash(signedTxn)
                                .build();

                signedHashLockTxn = myAcc.sign(unsignedHashLock, this.txnBuilder.generationHash);
                
            } catch (error) {
                throw new Error("Unable to set Aggregate Bonded transaction");
            } 
        }

        return {
            assetId: unsignedResult.assetId,
            txn: signedTxn,
            hashLockTxn: signedHashLockTxn
        };
    }

    async getNetwork(){

        if(this.networkType !== 0){
            return this.networkType;
        }
        else{
            try {
                let chainNetworkType = await firstValueFrom(this.networkHttp.getNetworkType());
                this.networkType = chainNetworkType; 
            } catch (error) {
                throw new Error("Error getting network type");   
            }

            return this.networkType;
        }
    }
}