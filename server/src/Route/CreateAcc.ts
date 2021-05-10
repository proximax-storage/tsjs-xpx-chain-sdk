import express from 'express';
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

// router.post('/is-new-acc', async (req, res, next) => {
//   let { uid } = req.body;
//   console.log(req.body);
//   let result;

//   try {
//     result = await isNewAcc(uid);
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }

//   res.status(200).json({ msg: result });
// });

export default router;
