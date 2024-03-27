/*
 * Copyright 2023 ProximaX
 * Copyright 2018 NEM
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

import { UInt64 } from '../UInt64';
import { MosaicPropertyType } from './MosaicPropertyType';
import { hasBit } from "../transaction/Utilities"

// bit position
export enum PropertyBit{
    Supply_Mutable = 1,
    Transferable,
    Restrictable,
    Supply_Force_Immutable,
    Disable_Locking
}

// property value
export enum PropertyValue{
    Supply_Mutable = 0x01,
    Transferable = 0x02,
    Restrictable = 0x04,
    Supply_Force_Immutable = 0x08,
    Disable_Locking = 0x10
}

/**
 * Mosaic properties model
 */
export class MosaicProperties {

    /**
     * The creator can choose between a definition that allows a mosaic supply change at a later point or an immutable supply.
     * Allowed values for the property are "true" and "false". The default value is "false".
     */
    public readonly supplyMutable: boolean;

    /**
     * The creator can choose if the mosaic definition should allow for transfers of the mosaic among accounts other than the creator.
     * If the property 'transferable' is set to "false", only transfer transactions
     * having the creator as sender or as recipient can transfer mosaics of that type.
     * If set to "true" the mosaics can be transferred to and from arbitrary accounts.
     * Allowed values for the property are thus "true" and "false". The default value is "true".
     */
    public readonly transferable: boolean;
    public readonly restrictable: boolean;
    public readonly supplyForceImmutable: boolean;
    public readonly disableLocking: boolean;

    /**
     * @param flags
     * @param divisibility
     * @param duration
     */
    constructor(flags: UInt64,
                /**
                 * The divisibility determines up to what decimal place the mosaic can be divided into.
                 * Thus a divisibility of 3 means that a mosaic can be divided into smallest parts of 0.001 mosaics
                 * i.e. milli mosaics is the smallest sub-unit.
                 * When transferring mosaics via a transfer transaction the quantity transferred
                 * is given in multiples of those smallest parts.
                 * The divisibility must be in the range of 0 and 6. The default value is "0".
                 */
                public readonly divisibility: number,
                /**
                 * The duration in blocks a mosaic will be available.
                 * After the duration finishes mosaic is inactive and can be renewed.
                 * Duration is optional when defining the mosaic
                 */
                public readonly duration?: UInt64) {
        const flagNumber = flags.compact();
        this.supplyMutable = hasBit(flagNumber, PropertyBit.Supply_Mutable);
        this.transferable = hasBit(flagNumber, PropertyBit.Transferable);
        this.restrictable = hasBit(flagNumber, PropertyBit.Restrictable);
        this.supplyForceImmutable = hasBit(flagNumber, PropertyBit.Supply_Force_Immutable);
        this.disableLocking = hasBit(flagNumber, PropertyBit.Disable_Locking);
    }

    /**
     * Static constructor function with default parameters
     * @returns {MosaicProperties}
     * @param params
     */
    public static create(params: {
        supplyMutable: boolean,
        transferable: boolean,
        restrictable: boolean,
        supplyForceImmutable: boolean,
        disableLocking: boolean,
        divisibility: number,
        duration?: UInt64,
    }) {
        const flags = 
            (params.supplyMutable ? PropertyValue.Supply_Mutable : 0) +
            (params.transferable ? PropertyValue.Transferable : 0) + 
            (params.restrictable ? PropertyValue.Restrictable : 0) + 
            (params.supplyForceImmutable ? PropertyValue.Supply_Force_Immutable : 0) +
            (params.disableLocking ? PropertyValue.Disable_Locking : 0);
        return new MosaicProperties(UInt64.fromUint(flags), params.divisibility, params.duration);
    }

    get flags(): number{
        return (this.supplyMutable ? PropertyValue.Supply_Mutable : 0) +
            (this.transferable ? PropertyValue.Transferable : 0) + 
            (this.restrictable ? PropertyValue.Restrictable : 0) + 
            (this.supplyForceImmutable ? PropertyValue.Supply_Force_Immutable : 0) +
            (this.disableLocking ? PropertyValue.Disable_Locking : 0);
    }

    /**
     * Create DTO object
     */
    toDTO() {
        const dto = [
            {
                id: MosaicPropertyType.MosaicFlags, 
                value: UInt64.fromUint(
                    (this.supplyMutable ? PropertyValue.Supply_Mutable : 0) +
                    (this.transferable ? PropertyValue.Transferable : 0) + 
                    (this.restrictable ? PropertyValue.Restrictable : 0) + 
                    (this.supplyForceImmutable ? PropertyValue.Supply_Force_Immutable : 0) +
                    (this.disableLocking ? PropertyValue.Disable_Locking : 0)
                ).toDTO()
            },
            {
                id: MosaicPropertyType.Divisibility, 
                value: UInt64.fromUint(this.divisibility).toDTO()
            },
        ];

        if (this.duration !== undefined) {
            dto.push({id: MosaicPropertyType.Duration, value: this.duration.toDTO()});
        }

        return dto;
    }
}
