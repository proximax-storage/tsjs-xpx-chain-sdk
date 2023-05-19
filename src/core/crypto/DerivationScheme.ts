/*
 * Copyright 2023 ProximaX
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
  * [Ed25519Sha3]: SHA3 hash algorithm - Account v1
  * [Ed25519Sha2]: SHA2 hash algorithm - Account v2
  */
export enum DerivationScheme {
  Unset,
	Ed25519Sha3,
	Ed25519Sha2
}
