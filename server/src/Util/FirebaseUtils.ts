// import firebase from 'firebase/app';
// import 'firebase/firestore';
import admin from 'firebase-admin';
const serviceAccount = require('./ServiceAccountKey.json');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const createAcc = async (uid: string, username: string, email: string) => {
  db.collection('accounts')
    .doc(uid)
    .set({
      username: username,
      email: email,
    })
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
    });
};

const getAccPrivateKeyById = (id: string): string | void => {
  const accRef = db.collection('accounts').doc(id);

  accRef.get().then((doc) => {
    if (!doc.exists) return;
    console.log('Document data:', doc.data());

    return doc.data().xpx_address;
  });
};

export { getAccPrivateKeyById, createAcc };
