import express from 'express';
import { getAccPrivateKeyById } from '../Util/FirebaseUtils';

const router = express.Router();

router.get('/download-private-key', (req, res, next) => {
  let id = req.body;
  const accPrivateKey = getAccPrivateKeyById(id);

  res.status(200).attachment(`xpx_private_key.txt`).send(accPrivateKey);
});

export default router;
