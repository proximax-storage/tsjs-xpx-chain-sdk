import express from 'express';
import { newUserWithEmailAndPwd } from '../Util/FirebaseUtils';

const router = express.Router();

router.post('/email-sign-in', (req, res, next) => {
  const { email, password } = req.body;
  const error = newUserWithEmailAndPwd(email, password);
  console.log(error);

  res.send('success');
});

// Require req json in following format
// email: string
// password: string
router.post('/sign-up', (req, res, next) => {
  const { email, password } = req.body;
  const error = newUserWithEmailAndPwd(email, password);
  console.log(error);

  res.send('success');
});

router.post('/sign-up', (req, res, next) => {});

export default router;
