const admin = require('firebase-admin');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('ascii')
    )
  ),
});

const db = admin.firestore();

const createAcc = async (uid, username, email) => {
  db.collection('accounts')
    .doc(uid)
    .set({
      username: username,
      email: email,
      stage: 'sign-up-success',
    })
    .then(() => {
      console.log('Acc successfully created!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
      throw error;
    });
};

const addAccAddress = async (uid, address) => {
  const accRef = db.collection('accounts').doc(uid);

  try {
    const res = await accRef.update({
      xpx_address: address,
      stage: 'home',
    });
    console.log(res);
  } catch (error) {
    console.log('Add address to db failed');
    console.log(error);
  }
};

const getUserInfo = async (uid) => {
  const accRef = db.collection('accounts').doc(uid);
  let username;

  try {
    const result = await accRef.get();
    username = result.data().username;

    console.log('getUserName API', result);

    return {
      username: result.data().username,
      address: result.data().xpx_address,
      stage: result.data().stage,
    };
  } catch (error) {
    throw error;
  }
};

exports.addAccAddress = addAccAddress;
exports.createAcc = createAcc;
exports.getUserInfo = getUserInfo;

// retrive info from firestore
// const isNewAcc = async (uid) => {
//   const accRef = db.collection('accounts').doc(uid);
//   const result = await accRef.get();
//   return !result.exists;
// };
