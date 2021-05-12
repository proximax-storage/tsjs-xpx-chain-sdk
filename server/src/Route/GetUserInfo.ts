import express from 'express';
import { getUsername } from '../Util/FirebaseUtils';

const router = express.Router();

router.post('/get-username', async (req, res, next) => {
  let { uid } = req.body;
  console.log(req.body);
  let username;

  try {
    username = await getUsername(uid);

    console.log(username);
  } catch (err) {
    console.log(err);
    throw err;
  }

  res.status(200).json({ username: username });
});

export default router;
