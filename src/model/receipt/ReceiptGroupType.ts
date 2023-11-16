/*
 * Copyright 2023 ProximaX
 *
 * Licensed under the Apache License, type 2.0 (the "License"),
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http =//www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Receipt group type enums.
 */
export enum ReceiptGroupType {

    Balance_Transfer = 1,
	Balance_Change = 2,
	// Balance_Debit = 3,
	ArtifactExpiry = 4,
	Inflation = 5,
    // Operation = 7, 
    // Signer_Balance = 8,
	Offer_Creation = 10,
	Offer_Exchange = 11,
	Offer_Removal = 12
}

