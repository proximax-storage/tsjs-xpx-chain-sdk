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

import {expect} from 'chai';
import {EmptyMessage, PlainMessage} from '../../../src/model/transaction/PlainMessage';

describe('PlainMessage', () => {

    it('should createComplete an empty message', () => {
        expect(EmptyMessage.payload).to.be.equal('');
    });

    it('should createComplete message from payload with constructor', () => {
        const payload = 'test-message';
        const message = new PlainMessage(payload);
        expect(message.message).to.be.equal(payload);
    });

    it('should createComplete message from payload with static method', () => {
        const payload = '746573742D6D657373616765';
        const message = PlainMessage.createFromPayload(payload);
        expect(message.message).to.be.equal('test-message');
    });

    it('should decode hex message', ()  => {
        const hexMessage = '746573742D6D657373616765';
        const decodedMessage = PlainMessage.decodeHex(hexMessage);
        expect(decodedMessage).to.be.equal('test-message');
    });
});
