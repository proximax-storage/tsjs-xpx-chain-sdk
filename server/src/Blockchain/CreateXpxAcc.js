const { Account, NetworkType } = require('tsjs-xpx-chain-sdk');

const generateXpxAcc = () => {
  const account = Account.generateNewAccount(NetworkType.TEST_NET);
  console.log('PK', account.privateKey);

  return { privateKey: account.privateKey, address: account.address };
};

exports.generateXpxAcc = generateXpxAcc;
