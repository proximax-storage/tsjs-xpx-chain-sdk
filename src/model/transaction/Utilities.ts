import {NetworkType} from '../blockchain/NetworkType';
import { Convert as convert } from '../../core/format/Convert';

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
