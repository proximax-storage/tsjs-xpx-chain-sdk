import { UInt64 } from "../UInt64";
import { ContractDTO } from "../../infrastructure/model/contractDTO";

export class Contract {
    constructor(
        public readonly multisig: string,
        public readonly multisigAddress: string,
        public readonly start: UInt64,
        public readonly duration: UInt64,
        public readonly hash: string,
        public readonly customers: string[],
        public readonly executors: string[],
        public readonly verifiers: string[]
    ) {

    }

    public static createFromDTO(contractDTO: ContractDTO) {
        return new Contract(
            contractDTO.multisig,
            contractDTO.multisigAddress,
            new UInt64(contractDTO.start),
            new UInt64(contractDTO.duration),
            contractDTO.hash,
            contractDTO.customers,
            contractDTO.executors,
            contractDTO.verifiers
        );
    }
}