

import express from 'express';

const router = express.Router();
const port = process.env.PORT || 5000;


router.post('/sign-in', (req, res, next) => {
  res.send("<h1>Hello</h1>")
});

router.post('/sign-up', (req, res, next) => {

  // TODO - Handle Sign up
  // TODO - Add the Create Xpx Acc at the end
  // TODO - Store to firebase
});



export default router;