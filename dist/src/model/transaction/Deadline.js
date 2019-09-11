"use strict";
/*
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
Object.defineProperty(exports, "__esModule", { value: true });
const js_joda_1 = require("js-joda");
const UInt64_1 = require("../UInt64");
/**
 * The deadline of the transaction. The deadline is given as the number of seconds elapsed since the creation of the nemesis block.
 * If a transaction does not get included in a block before the deadline is reached, it is deleted.
 */
class Deadline {
    /**
     * @param deadline
     */
    constructor(deadline) {
        this.value = deadline;
    }
    /**
     * Create deadline model
     * @param deadline
     * @param chronoUnit
     * @returns {Deadline}
     */
    static create(deadline = 2, chronoUnit = js_joda_1.ChronoUnit.HOURS) {
        const networkTimeStamp = (new Date()).getTime();
        const timeStampDateTime = js_joda_1.LocalDateTime.ofInstant(js_joda_1.Instant.ofEpochMilli(networkTimeStamp), js_joda_1.ZoneId.SYSTEM);
        const deadlineDateTime = timeStampDateTime.plus(deadline, chronoUnit);
        if (deadline <= 0) {
            throw new Error('deadline should be greater than 0');
        }
        else if (timeStampDateTime.plus(24, js_joda_1.ChronoUnit.HOURS).compareTo(deadlineDateTime) !== 1) {
            throw new Error('deadline should be less than 24 hours');
        }
        return new Deadline(deadlineDateTime);
    }
    /**
     * @internal
     * @param value
     * @returns {Deadline}
     */
    static createFromDTO(value) {
        const dateSeconds = (new UInt64_1.UInt64(value)).compact();
        const deadline = js_joda_1.LocalDateTime.ofInstant(js_joda_1.Instant.ofEpochMilli(Math.round(dateSeconds + Deadline.timestampNemesisBlock * 1000)), js_joda_1.ZoneId.SYSTEM);
        return new Deadline(deadline);
    }
    /**
     * @internal
     */
    toDTO() {
        return UInt64_1.UInt64.fromUint((this.value.atZone(js_joda_1.ZoneId.SYSTEM).toInstant().toEpochMilli() - Deadline.timestampNemesisBlock * 1000)).toDTO();
    }
}
/**
 * @type {number}
 */
Deadline.timestampNemesisBlock = 1459468800;
exports.Deadline = Deadline;
//# sourceMappingURL=Deadline.js.map