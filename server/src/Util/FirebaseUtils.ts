import firebase from 'firebase/app';
import 'firebase/firestore';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const getAccById = async (id: string) => {
  const accRef = db.collection('accounts').doc(id);

  accRef.get().then((doc) => {
    if (!doc.exists) return;
    console.log('Document data:', doc.data());

    return doc.data();
  });
};

export { getAccById };
