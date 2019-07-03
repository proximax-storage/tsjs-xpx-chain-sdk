import { UInt64 } from "../UInt64";
import { ContractDTO } from "../../infrastructure/model/contractDTO";
export declare class Contract {
    readonly multisig: string;
    readonly multisigAddress: string;
    readonly start: UInt64;
    readonly duration: UInt64;
    readonly hash: string;
    readonly customers: string[];
    readonly executors: string[];
    readonly verifiers: string[];
    constructor(multisig: string, multisigAddress: string, start: UInt64, duration: UInt64, hash: string, customers: string[], executors: string[], verifiers: string[]);
    static createFromDTO(contractDTO: ContractDTO): Contract;
}
