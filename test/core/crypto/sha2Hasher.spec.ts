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
import {expect} from 'chai';
import {SHA2Hasher as sha2Hasher} from '../../../src/core/crypto/SHA2Hasher';
import {Convert as convert} from '../../../src/core/format';

describe('hasher', () => {
    const inputs = [
        '',
        'CC',
        '41FB',
        '1F877C',
        'C1ECFDFC',
        '9F2FCC7C90DE090D6B87CD7E9718C1EA6CB21118FC2D5DE9F97E5DB6AC1E9C10'
    ];

    function addSha2Tests(length, expectedOutputs) {
        describe('func', () => {
            it('can hash test vectors', () => {
                // Sanity:
                expect(expectedOutputs.length).equal(inputs.length);

                for (let i = 0; i < inputs.length; ++i) {
                    // Arrange:
                    const inputHex = inputs[i];
                    const inputBuffer = convert.hexToUint8(inputHex);
                    const expectedHash = expectedOutputs[i];

                    // Act:
                    const hash = new Uint8Array(length);
                    sha2Hasher.func(hash, inputBuffer, length);

                    // Assert:
                    expect(convert.uint8ArrayToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
                }
            });
        });

        describe('object', () => {
            it('can hash test vectors', () => {
                // Sanity:
                expect(expectedOutputs.length).equal(inputs.length);

                for (let i = 0; i < inputs.length; ++i) {
                    // Arrange:
                    const inputHex = inputs[i];
                    const inputBuffer = convert.hexToUint8(inputHex);
                    const expectedHash = expectedOutputs[i];

                    const hasher = sha2Hasher.createHasher(length);
                    hasher.reset();

                    // Act: hash the input in two parts
                    hasher.update(inputBuffer.subarray(0, inputBuffer.length / 2));
                    hasher.update(inputBuffer.subarray(inputBuffer.length / 2));

                    const hash = new Uint8Array(length);
                    hasher.finalize(hash);

                    // Assert:
                    expect(convert.uint8ArrayToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
                }
            });

            it('can hash string', () => {
                // Arrange:
                const inputHex = inputs[3];
                const expectedHash = expectedOutputs[3];

                const hasher = sha2Hasher.createHasher(length);
                hasher.reset();

                // Act:
                hasher.update(inputHex);

                const hash = new Uint8Array(length);
                hasher.finalize(hash);

                // Assert:
                expect(convert.uint8ArrayToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
            });

            it('cannot hash unsupported data type', () => {
                // Arrange:
                const hasher = sha2Hasher.createHasher(length);
                hasher.reset();

                // Act:
                expect(() => hasher.update({})).to.throw('unsupported data type');
            });

            it('can reuse after reset', () => {
                // Arrange:
                const inputHex = inputs[3];
                const expectedHash = expectedOutputs[3];

                const hasher = sha2Hasher.createHasher(length);
                hasher.reset();
                hasher.update('ABCD');

                // Act:
                hasher.reset();
                hasher.update(inputHex);

                const hash = new Uint8Array(length);
                hasher.finalize(hash);

                // Assert:
                expect(convert.uint8ArrayToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
            });
        });
    }

    describe('sha512/256', () => {
        addSha2Tests(32, [
            'C672B8D1EF56ED28AB87C3622C5114069BDD3AD7B8F9737498D0C01ECEF0967A',
            'D5F81362D440A0E37CED6D51B8AE977435BCF11767A0D36761269B68E0CE4CCA',
            'BDEE4E911FABFDB495270F9F644B5A327457D37FE63CFA0CA34E393F8BFF5E3A',
            '34CC9D0E30FC3A86198C0CF6F3816197B220C75244ED545F1BBB62BF2898876B',
            '0E71AF0075BFDFB3C165478941BCFB902362158EE57E056B761D15E4C8BF9976',
            'D9C930685259709AF2A3987EB7C9E09951E4A0000D4913ECA277AB47413DCB59'
        ]);
    });

    describe('sha512', () => {
        addSha2Tests(64, [
            'CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE47D0D13C5D85F2B0FF8318D2877EEC2F63B931BD47417A81A538327AF927DA3E',
            '62B9F8C512899CCCAD9AFB9F5AF8AE591F36E2B0588FD02510735EB543FCD5167F5058F468EC3CFB56CC4CFBBD43BDA37F3DBF2496E5895139D15A70367AB9F0',
            'F32AFB62ADEF2F4579456D2DBDA268897737C6B0185C0858BE369923E8AD40C15F9D3691837B49278DE2BAAA46DF77EEA8F3E713A7466CFD580DA9D28C73F283',
            '45BCC9D1F340CDD119FA1AFCC4F7AC657FA2D0BCA5852498EEE9C9F02F93EB2B1350E1C9567F6F18CCC5576D36812F686F31C26E2EFA6BBEE9FC7F5F5FFF7FA9',
            '0068125B83FBA7690978D5B591D5E7644BBD7ADF8011DD592D44F269DC31B3873136121872B2C8FAE70E2614266BF46ABB374006FE82CECEDFAD2644FECF140A',
            'FF6EBF72E7E9BC05E06A3DDBAC4298B68DCF50374BD74E910977A496F41270931268FABB3774B73EEC64E5D729C75D0887112E2FAD4DFA7DCEB8D1D97A3DFE44'
        ]);
    });
});
