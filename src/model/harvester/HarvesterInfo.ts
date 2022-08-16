
import { PublicAccount } from "../account/PublicAccount";
import { HarvesterInfoDTO } from "../../infrastructure/model/harvesterInfoDTO";
import { UInt64 } from "../UInt64";
import { NetworkType } from "../model";

export class HarvesterInfo{

    constructor(
        readonly harvesterKey: PublicAccount,
        readonly owner: PublicAccount,
        readonly disabledHeight: UInt64,
        readonly lastSigningBlockHeight: UInt64,
        readonly effectiveBalance: UInt64,
        readonly canHarvest: boolean,
        readonly activity: number,
        readonly greed: number
    ){

    }

    static createFromDTO(dto: HarvesterInfoDTO, networkType: NetworkType){
        return new HarvesterInfo(
            PublicAccount.createFromPublicKey(dto.key, networkType),
            PublicAccount.createFromPublicKey(dto.owner, networkType),
            new UInt64(dto.disabledHeight),
            new UInt64(dto.lastSigningBlockHeight),
            new UInt64(dto.effectiveBalance),
            dto.canHarvest,
            dto.activity,
            dto.greed
        );
    }
}