import express from 'express';
import { generateXpxAcc } from '../Blockchain/CreateXpxAcc';
import { addAccAddress } from '../Util/FirebaseUtils';

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

  // res.status(200).attachment(`xpx_private_key.txt`).send(privateKey);
  res.status(200).send(privateKey);
});

export default router;
