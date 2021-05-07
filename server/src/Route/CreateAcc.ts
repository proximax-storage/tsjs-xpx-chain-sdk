import express from 'express';
// import {  } from '../Util/FirebaseUtils';
import { createAcc } from '../Util/FirebaseUtils';

const router = express.Router();

router.post('/create-acc', async (req, res, next) => {
  let { uid, username, email } = req.body;
  console.log(req.body);

  try {
    await createAcc(uid, username, email);
  } catch (err) {
    console.log(err);
    throw err;
  }

  res.status(200).json({ msg: 'success' });
});

export default router;
