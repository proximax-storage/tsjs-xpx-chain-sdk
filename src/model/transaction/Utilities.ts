import { Convert as convert } from '../../core/format/Convert';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { NetworkType } from '../blockchain/NetworkType';
import { MultisigAccountGraphInfo } from '../account/MultisigAccountGraphInfo';
import { MultisigAccountInfo } from '../account/MultisigAccountInfo';
import { ChronoUnit } from "@js-joda/core";
import { sha3_256 } from "@noble/hashes/sha3";
import { hexToBytes, bytesToHex } from "@noble/hashes/utils";
import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { MetadataType } from '../metadata/MetadataType';
import { Base32 } from '../../core/format/Base32';

export enum TimeUnit {
    DAY = 4,
    HOUR = 3,
    MINUTE = 2,
    SECOND = 1,
    MILLISECOND = 0
}
/**
 * @param versionHex - Transaction version in hex
 * @returns {NetworkType}
 */
export const extractNetwork = (versionHex: string): NetworkType => {
    const networkType = convert.hexToUint8(versionHex)[3];
    if (networkType === NetworkType.MAIN_NET) {
        return NetworkType.MAIN_NET;
    } else if (networkType === NetworkType.TEST_NET) {
        return NetworkType.TEST_NET;
    } else if (networkType === NetworkType.MIJIN) {
        return NetworkType.MIJIN;
    } else if (networkType === NetworkType.MIJIN_TEST) {
        return NetworkType.MIJIN_TEST;
    } else if (networkType === NetworkType.PRIVATE) {
        return NetworkType.PRIVATE;
    } else if (networkType === NetworkType.PRIVATE_TEST) {
        return (NetworkType.PRIVATE_TEST)
    }
    throw new Error('Unimplemented network type');
};

export const hasBit = (numberToCompare:number, bitPosition: number): boolean => {
    const bitsNumber = bitPosition > 1 ? 1 << (bitPosition-1): 1;
	return (numberToCompare & bitsNumber) == bitsNumber;
}

export const hasBits = (numberToCompare:number, bitsNumber: number): boolean => {
	return (numberToCompare & bitsNumber) == bitsNumber;
}

export const convertStringTimeUnit = (startUnit: string, targetUnit: number): number =>{
    
    let initUnit: TimeUnit = TimeUnit.SECOND;    
    let unitAmount: number = parseInt(startUnit);
    let checkUnit = startUnit.toLowerCase();

    if(checkUnit.search('day') > -1 || checkUnit.search('d') > -1){
        initUnit = TimeUnit.DAY;
    }
    else if(checkUnit.search('hour') > -1 || checkUnit.search('h') > -1){
        initUnit = TimeUnit.HOUR;
    }
    else if(checkUnit.search('millisecond') > -1 || checkUnit.search('ms') > -1){
        initUnit = TimeUnit.MILLISECOND;
    }
    else if(checkUnit.search('minute') > -1 || checkUnit.search('m') > -1){
        initUnit = TimeUnit.MINUTE;
    }
    else if(checkUnit.search('sec') > -1 || checkUnit.search('s') > -1){
        initUnit = TimeUnit.SECOND;
    }

    return convertTimeUnit(unitAmount, initUnit, targetUnit);
}

export const convertTimeUnit = (amount: number, startUnit: TimeUnit, targetUnit: TimeUnit): number =>{
    
    let downDirection: boolean = false;

    if(targetUnit > startUnit){
        downDirection = false;
    }
    else if(targetUnit < startUnit){
        downDirection = true;
    }
    else if(startUnit === targetUnit){
        return amount;
    }

    let newAmount: number;
    let newUnit: TimeUnit;

    if(downDirection){
        if(startUnit === TimeUnit.DAY){
            newAmount = amount * 24;
        }
        else if(startUnit === TimeUnit.HOUR){
            newAmount = amount * 60;
        }
        else if(startUnit === TimeUnit.MINUTE){
            newAmount = amount * 60;
        }
        else if(startUnit === TimeUnit.SECOND){
            newAmount = amount * 1000;
        }
        else{
            return amount;
        }
    }
    else{
        if(startUnit === TimeUnit.HOUR){
            newAmount = amount / 24;
        }
        else if(startUnit === TimeUnit.MINUTE){
            newAmount = amount / 60;
        }
        else if(startUnit === TimeUnit.SECOND){
            newAmount = amount / 60;
        }
        else if(startUnit === TimeUnit.MILLISECOND){
            newAmount = amount / 1000;
        }
        else{
            return amount;
        }
    }

    newUnit = downDirection ? startUnit - 1 : startUnit + 1;
    
    return convertTimeUnit(newAmount, newUnit, targetUnit);
}

export const checkCosigner = (cosignerPublicKey: string, multisigAccPublicKey: string, multisigAccGraph: MultisigAccountGraphInfo) =>{

    let levelZeroData = multisigAccGraph.multisigAccounts.get(0);

    if(!levelZeroData || levelZeroData[0].account.publicKey !== multisigAccPublicKey){
        throw new Error("Please pass in the multisig account graph of the multisig account");
    }

    let isCosigner = false;
    let signable = false;
    let aggComplete = false;
    let minimumApproval = levelZeroData[0].minApproval;
    let cosignerLevel = 0;
    let allMultisigAccInfo: MultisigAccountInfo[] = [];
    let paths: Map<string, string[]> = new Map(); 

    let iterator = multisigAccGraph.multisigAccounts.entries();

    for (const [level, multisigAccInfo] of iterator) {

        allMultisigAccInfo = allMultisigAccInfo.concat(multisigAccInfo);

        if(level > 0){
            for(let i=0; i < multisigAccInfo.length; ++i){

                if(multisigAccInfo[i].account.publicKey === cosignerPublicKey){

                    cosignerLevel = level;
                    isCosigner = true;
                    if(multisigAccInfo[i].cosignatories.length === 0){
                        signable = true;
                    }
                }
            }
        }
    }

    if(signable && minimumApproval === 1){
        let tracingPublicKeys = [cosignerPublicKey];
        paths.set(cosignerPublicKey, [cosignerPublicKey]);

        while(tracingPublicKeys.length){
            let filteredEntry = allMultisigAccInfo.filter(x => x.cosignatories.length > 0 && x.cosignatories.some(y => tracingPublicKeys.includes(y.publicKey)));

            if(filteredEntry.length){

                for(const entry of filteredEntry){
                    let newPaths: string[] = [];
                    let entryCosigner: string[] = entry.cosignatories.map(x => x.publicKey);
                    
                    for(const pk of tracingPublicKeys){
                        if(entryCosigner.includes(pk)){
                            let previousPath = paths.get(pk);
                            if(previousPath){
                                newPaths = newPaths.concat(previousPath.map(x=> x.concat("/"+entry.account.publicKey)));
                            }
                        }
                    }

                    paths.set(entry.account.publicKey, newPaths);
                }

                tracingPublicKeys = filteredEntry.map(x => x.account.publicKey);
            }
            else{
                tracingPublicKeys = [];
                break;
            }
        }

        const finalPaths = paths.get(multisigAccPublicKey);

        if(finalPaths){
            for(const finalPath of finalPaths){

                const splittedPublicKey = finalPath.split("/");
                let minApprovalIndicator = 0;

                for(const currentPK of splittedPublicKey){
                    const foundData = allMultisigAccInfo.find(x => x.account.publicKey === currentPK);

                    if(foundData && foundData.minApproval !== 0){
                        if(minApprovalIndicator === 0){
                            minApprovalIndicator = foundData.minApproval;
                        }
                        else{
                            minApprovalIndicator = minApprovalIndicator * foundData.minApproval;
                        }
                    }
                }

                if(minApprovalIndicator === 1){
                    aggComplete = true;
                    break;
                }
            }
        }
    }

    return {
        isCosigner: isCosigner,
        cosignerSignable: signable,
        aggComplete: aggComplete
    }
}

/**
 * Get lower value from maxBondedTransactionLifetime and maxHashLockDuration, 
 * comparison is done with second. 
 * This ensure expiration of both life time and lock duration of Aggregate Bonded Transaction 
 * can be set using almost the nearest time. 
 * @param maxBondedTransactionLifetime - Network config of max bonded transaction life time
 * @param maxHashLockDuration - Network config of max hash lock duration
 * @returns 
 */
export const getABTMinConfigSeconds = (maxBondedTransactionLifetime: number, maxHashLockDuration: number): number=>{

    let abtLifeTimeInSeconds = Math.min(maxBondedTransactionLifetime, maxHashLockDuration);

    return abtLifeTimeInSeconds;
}

/**
 * Get a maximum block duration for Aggregate Bonded Transaction for Sirius Chain
 * @param blockGenerationTargetTime - Network config of targeted block generation time
 * @param maxBondedTransactionLifetime - Network config of max bonded transaction life time
 * @param maxHashLockDuration - Network config of max hash lock duration
 * @returns 
 */
export const getABTMaxSafeDurationWithSeconds = (blockGenerationTargetTime: number, maxBondedTransactionLifetime: number, maxHashLockDuration: number): number =>{

    let abtLifeTimeInSeconds = getABTMinConfigSeconds(maxBondedTransactionLifetime, maxHashLockDuration);

    let safeMaxBlockDuration = Math.floor(abtLifeTimeInSeconds/blockGenerationTargetTime) - 1;

    return safeMaxBlockDuration;
}

/**
 * Get a maximum Deadline for Aggregate Bonded Transaction for Sirius Chain 
 * @param maxBondedTransactionLifetime - Network config of max bonded transaction life time 
 * @param maxHashLockDuration - Network config of max hash lock duration
 * @param currentNodeTimetamp - When added, it is able to create a Deadline that is Daylight saving time safe.
 * @returns 
 */
export const getABTMaxSafeDeadlineWithSeconds = (maxBondedTransactionLifetime: number, maxHashLockDuration: number, currentNodeTimetamp?: UInt64): Deadline =>{
    let abtLifeTimeInSeconds = getABTMinConfigSeconds(maxBondedTransactionLifetime, maxHashLockDuration);

    let safeMaxDeadline: Deadline;

    if(currentNodeTimetamp){
      let deadlineUint64 = UInt64.fromUint(currentNodeTimetamp.compact() + ((abtLifeTimeInSeconds - 5) * 1000));

      safeMaxDeadline = Deadline.createFromUint64(deadlineUint64);
    }
    else{
      safeMaxDeadline = Deadline.createForBonded(abtLifeTimeInSeconds - 5, ChronoUnit.SECONDS);
    }

    return safeMaxDeadline;
}

export const getConfigSetting = (parsedConfig: object, keys: string[], targetTimeUnit?: TimeUnit)=>{

    let currentSection = parsedConfig;
    let value: any = null;

    for(let i = 0; i < keys.length; i++){
        if(currentSection[keys[i]]){
            value = currentSection[keys[i]];
            currentSection = value;
        }
        else{
            return null;
        }
    }

    if(targetTimeUnit){
        value = convertTimeUnit(value, TimeUnit.MILLISECOND, targetTimeUnit);
    }

    return value;
}

type ConfigObject = { [key: string]: string | number | boolean | ConfigObject };

export const parseConfig = (input: string): ConfigObject => {
    const result: ConfigObject = {};
    let currentSection: ConfigObject = result;

    input.split(/\n+/).forEach(line => {
        line = line.trim();
        
        if (!line || line.startsWith("#")) return; // Skip empty lines and comments

        const sectionMatch = line.match(/^\[(.+)]$/);
        if (sectionMatch) {
            currentSection = result;
            const keys = sectionMatch[1].split(':'); // Handle nested sections
            keys.forEach((key, index) => {
                if (!(key in currentSection)) {
                    currentSection[key] = {};
                }
                currentSection = currentSection[key] as ConfigObject; // Move deeper into nested object
            });
            return;
        }

        const keyValueMatch = line.match(/^(.+?)\s*=\s*(.+)$/);
        if (keyValueMatch) {
            let key = keyValueMatch[1].trim();
            let value: string | number | boolean = keyValueMatch[2].trim();

            // Convert values intelligently
            if (/^\d+$/.test(value)) {
                value = parseInt(value, 10);
            } else if (/^\d+\.\d+$/.test(value)) {
                value = parseFloat(value);
            } else if (/^(true|false)$/i.test(value)) {
                value = value.toLowerCase() === "true";
            } else if (/^(\d+)(s|ms|m|h|d)$/.test(value)) {
                // Handle time units like 10s, 5m, 2h, 1d
                const [, num, unit] = value.match(/^(\d+)(s|ms|m|h|d)$/) || [];
                const timeMultipliers: { [key: string]: number } = { ms: 1, s: 1000, m: 60000, h: 3600000, d: 86400000 };
                value = parseInt(num, 10) * (timeMultipliers[unit] || 1);
            } else if (/^\d{1,3}(?:'\d{3})*$/.test(value)) {
                // Handle large numbers with apostrophes (e.g., "9'000'000'000")
                value = parseInt(value.replace(/'/g, ""), 10);
            }

            currentSection[key] = value;
        }
    });

    return result;
}

export const genMetadataCompositeHash = (creatorPublicAcc: PublicAccount, scopedMetadataKey: UInt64, 
    metadataType: MetadataType,
    targetId: UInt64 | MosaicId | NamespaceId)=>{
    
    const compositeHash = sha3_256
            .create()
            .update((Base32.Base32Decode(creatorPublicAcc.address.plain())))
            .update(hexToBytes(creatorPublicAcc.publicKey))
            .update(hexToBytes(scopedMetadataKey.toHex()).reverse())
            .update(metadataType === MetadataType.ACCOUNT ? new Uint8Array(8).fill(0) : hexToBytes(targetId.toHex()).reverse())
            .update(new Uint8Array([metadataType]))
            .digest();

    return bytesToHex(compositeHash);
}