import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

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

const getAccPrivateKeyById = (id: string): string | void => {
  const accRef = db.collection('accounts').doc(id);

  accRef.get().then((doc) => {
    if (!doc.exists) return;
    console.log('Document data:', doc.data());

    return doc.data().xpx_address;
  });
};

const signInWithEmail = (email: string, password: string) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
};

const newUserWithEmailAndPwd = (email: string, password: string) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log('### Firebase Auth', user.uid);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return error;
    });
};

export { getAccPrivateKeyById, newUserWithEmailAndPwd };

// const auth = firebase.auth();

// export const googleProvider = new firebase.auth.GoogleAuthProvider();

// export const twitterProvider = new firebase.auth.TwitterAuthProvider();

// export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

// export const getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     const unsubscribe = auth.onAuthStateChanged((userAuth)=> {
//       unsubscribe();
//       resolve(userAuth);
//     }, reject);
//   });
// }