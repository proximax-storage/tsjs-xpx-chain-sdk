const express = require('express');
const { getUserInfo } = require('../Util/FirebaseUtils');

const router = express.Router();

router.post('/get-userinfo', async (req, res, next) => {
  let { uid } = req.body;
  console.log(req.body);
  let userInfo;

  try {
    userInfo = await getUserInfo(uid);

    console.log(userInfo);
  } catch (err) {
    console.log(err);
    throw err;
  }

  res.status(200).json({ userInfo: userInfo });
});

module.exports = router;
