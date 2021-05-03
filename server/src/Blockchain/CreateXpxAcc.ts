import { Account, NetworkType } from 'tsjs-xpx-chain-sdk';

const generateXpxAcc = () => {
  const account = Account.generateNewAccount(NetworkType.TEST_NET);

  // console.log('Address:', account.address.pretty());
  // console.log('PrivateKey:', account.privateKey);
  // console.log('PublicKey:', account.publicKey);

  return account.privateKey;
};

export { generateXpxAcc };
