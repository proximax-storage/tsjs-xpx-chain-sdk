import { NetworkType } from '../model';
import {PublicAccount} from './PublicAccount';

export class SupplementalPublicKeys{

    constructor(
        public readonly linked?: PublicAccount, 
        public readonly node?: PublicAccount, 
        public readonly vrf?: PublicAccount){
    }

    public static create(params: {
        linked: string,
        node: string,
        vrf: string
    }, networkType: NetworkType) {
        return new SupplementalPublicKeys(
            params.linked ? PublicAccount.createFromPublicKey(params.linked, networkType): undefined,
            params.node ? PublicAccount.createFromPublicKey(params.node, networkType): undefined,
            params.vrf ? PublicAccount.createFromPublicKey(params.vrf, networkType): undefined,            
        );
    }
}