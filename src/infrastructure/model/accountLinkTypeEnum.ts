/** 
 * Copyright 2023 ProximaX Limited. 
 * All rights reserved. 
 * Use of this source code is governed by the Apache 2.0
 * license that can be found in the LICENSE file
*/
import { RequestFile } from '../api';

/**
* The account link types: 
* 0 -  Unlinked. Account is not linked to another account. 
* 1 -  Main. Account is a balance-holding account that is linked to a remote harvester account. 
* 2 -  Remote. Account is a remote harvester account that is linked to a balance-holding account. 
* 3 -  Remote_Unlinked. Account is a remote harvester eligible account that is unlinked. 
* 4 -  Locked. Account that is locked after v2 upgrade transaction  
*/
export enum AccountLinkTypeEnum {
    NUMBER_0 = <any> 0,
    NUMBER_1 = <any> 1,
    NUMBER_2 = <any> 2,
    NUMBER_3 = <any> 3,
    NUMBER_4= <any> 4
}
