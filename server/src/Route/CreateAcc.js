const express = require('express');
const { createAcc } = require('../Util/FirebaseUtils');

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

module.exports = router;
