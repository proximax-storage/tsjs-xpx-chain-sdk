import { UpgradeDTO } from "../../infrastructure/model/upgradeDTO";
import { UInt64 } from "../UInt64";
/**
 * The upgrade structure stores a required chain version at given height as returned from http upgradeRoutesApi.
 */
export declare class ChainUpgrade {
    readonly height: UInt64;
    readonly catapultVersion: UInt64;
    constructor(height: UInt64, catapultVersion: UInt64);
    static createFromDTO(upgradeDTO: UpgradeDTO | undefined): ChainUpgrade;
}
