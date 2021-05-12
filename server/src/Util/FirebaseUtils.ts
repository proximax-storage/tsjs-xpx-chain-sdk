import admin from 'firebase-admin';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('ascii')
    )
  ),
});

const db = admin.firestore();

const createAcc = async (uid: string, username: string, email: string) => {
  db.collection('accounts')
    .doc(uid)
    .set({
      username: username,
      email: email,
      address: null,
    })
    .then(() => {
      console.log('Acc successfully created!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
      throw error;
    });
};

const addAccAddress = async (uid: string, address: string) => {
  const accRef = db.collection('accounts').doc(uid);

  try {
    const res = await accRef.update({
      address: address,
    });
    console.log(res);
  } catch (error) {
    console.log('Add address to db failed');
    console.log(error);
  }
};

// const isNewAcc = async (uid: string) => {
//   const accRef = db.collection('accounts').doc(uid);
//   const result = await accRef.get();
//   return !result.exists;
// };

export { addAccAddress, createAcc };
