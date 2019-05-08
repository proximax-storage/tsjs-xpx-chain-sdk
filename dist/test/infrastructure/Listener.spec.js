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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Listener_1 = require("../../src/infrastructure/Listener");
describe('Listener', () => {
    it('should createComplete a WebSocket instance given url parameter', () => {
        const listener = new Listener_1.Listener('ws://localhost:3000');
        chai_1.expect('ws://localhost:3000/ws').to.be.equal(listener.url);
        listener.close();
    });
    describe('isOpen', () => {
        it('should return false when listener is created and not opened', () => {
            const listener = new Listener_1.Listener('ws://localhost:3000');
            chai_1.expect(listener.isOpen()).to.be.false;
            listener.close();
        });
    });
    describe('onerror', () => {
        it('should reject because of wrong server url', () => __awaiter(this, void 0, void 0, function* () {
            const listener = new Listener_1.Listener('https://notcorrecturl:0000');
            yield listener.open()
                .then((result) => {
                listener.close();
                throw new Error('This should not be called when expecting error');
            })
                .catch((error) => {
                listener.close();
                chai_1.expect(error.message.toString()).to.be.equal("getaddrinfo ENOTFOUND notcorrecturl notcorrecturl:0000");
            });
        }));
    });
});
//# sourceMappingURL=Listener.spec.js.map