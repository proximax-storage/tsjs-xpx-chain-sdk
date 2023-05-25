import { 
    TransactionMapping, AggregateTransaction, PublicAccount, NetworkType, Account, 
    ChainConfigHttp, ChainHttp 
} from "../dist";

const API_URL = "http://13.229.210.71:3000";

const configHttp = new ChainConfigHttp(API_URL);
const chainHttp = new ChainHttp(API_URL);

chainHttp.getBlockchainHeight().subscribe((data)=>{

    configHttp.getChainConfig(data.compact()).subscribe((chainData)=>{
        console.log(chainData.supportedEntityVersions);
    });
});

