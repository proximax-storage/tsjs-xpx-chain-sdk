/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 0 - Unlinked.
 * 1 - Main account that is linked to a remote harvester account.
 * 2 - Remote harvester account that is linked to a balance-holding account.
 * 3 - Remote harvester eligible account that is unlinked.
 * 4 - Locked account that is locked after v2 upgrade transaction 
 */

 export enum AccountType {
    Unlinked,
    Main,
    Remote,
    Remote_Unlinked,
    Locked
}
