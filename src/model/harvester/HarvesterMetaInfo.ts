
import { HarvesterInfoWithMetaDTO } from "../../infrastructure/model/harvesterInfoWithMetaDTO";
import { UInt64 } from "../UInt64";
import { NetworkType } from "../model";
import { PublicAccount } from "../account/PublicAccount";

export class HarvesterMetaInfo{

    constructor(
        readonly harvesterKey: PublicAccount,
        readonly owner: PublicAccount,
        readonly disabledHeight: UInt64,
        readonly lastSigningBlockHeight: UInt64,
        readonly effectiveBalance: UInt64,
        readonly canHarvest: boolean,
        readonly activity: number,
        readonly greed: number,
        readonly metaId: string
    ){

    }

    /**
     * @param dto 
     * @param networkType 
     * @returns 
     */
    static createFromDTO(dto: HarvesterInfoWithMetaDTO, networkType: NetworkType): HarvesterMetaInfo{
        return new HarvesterMetaInfo(
            PublicAccount.createFromPublicKey(dto.harvester.key, networkType),
            PublicAccount.createFromPublicKey(dto.harvester.owner, networkType),
            new UInt64(dto.harvester.disabledHeight),
            new UInt64(dto.harvester.lastSigningBlockHeight),
            new UInt64(dto.harvester.effectiveBalance),
            dto.harvester.canHarvest,
            dto.harvester.activity,
            dto.harvester.greed,
            dto.meta.id
        );
    }
}