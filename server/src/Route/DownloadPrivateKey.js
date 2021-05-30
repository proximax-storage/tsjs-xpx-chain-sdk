const express = require('express');
const { generateXpxAcc } = require('../Blockchain/CreateXpxAcc');
const { addAccAddress } = require('../Util/FirebaseUtils');

const router = express.Router();

router.post('/download-private-key', async (req, res, next) => {
  console.log('download api');
  let { uid } = req.body;
  const { privateKey, address } = generateXpxAcc();

  try {
    await addAccAddress(uid, address.plain());
  } catch (error) {
    console.log(error);
  }

  res.status(200).send(privateKey);
});

module.exports = router;
