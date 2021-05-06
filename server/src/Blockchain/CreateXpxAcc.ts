import { Account, NetworkType } from 'tsjs-xpx-chain-sdk';

const generateXpxAcc = () => {
  const account = Account.generateNewAccount(NetworkType.TEST_NET);

  return account.privateKey;
};

export { generateXpxAcc };
