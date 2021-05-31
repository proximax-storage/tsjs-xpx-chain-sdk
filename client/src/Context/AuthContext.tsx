import React, { useContext, useState, useEffect } from 'react';

import {
  auth,
  googleProvider,
  twitterProvider,
} from '../Util/Firebase/FirebaseConfig';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import { getUserInfoByUid } from '../Util/API/NavBarHomeAPI';

type AuthContextType = {
  signUp: (email: string, password: string, username: string) => any;
  emailSignIn: (email: string, password: string) => void;
  googleSignIn: () => any;
  twitterSignIn: () => any;
  signOut: () => void;
  currentUser: any;
  curAddress: string;
  hasXpxAcc: boolean;
  setHasXpxAcc: (x: boolean) => void;
  setAddress: (add: string) => void;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [curAddress, setAddress] = useState('');
  const [hasXpxAcc, setHasXpxAcc] = useState(true);

  const setLocalStorageUser = (result: any) => {
    localStorage.setItem(
      LocalStorageEnum.DISPLAY_NAME,
      result.user.displayName
    );
    localStorage.setItem(LocalStorageEnum.UID, result.user.uid);
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);

      setLocalStorageUser(result);
      localStorage.setItem(LocalStorageEnum.DISPLAY_NAME, username)

      return result.user.uid;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    const result = await auth.signInWithEmailAndPassword(email, password);
    setLocalStorageUser(result);

    const user = await getUserInfoByUid(result.user.uid);
    const { username } = user.data.userInfo;

    console.log('Email Sign In', user);
    localStorage.setItem(LocalStorageEnum.DISPLAY_NAME, username);

    console.log('LS', LocalStorageEnum.DISPLAY_NAME, username);
  };

  const googleSignIn = async () => {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    return await externalSignIn(googleProvider);
  };

  const twitterSignIn = async () => {
    return await externalSignIn(twitterProvider);
  };

  const externalSignIn = async (provider: any) => {
    try {
      const result = await auth.signInWithPopup(provider);

      setLocalStorageUser(result);

      return {
        uid: result.user.uid,
        email: result.user.email,
        username: result.user.displayName,
        isNewUser: result.additionalUserInfo.isNewUser,
      };
    } catch (err) {
      console.log(err);
    }
  };

  const signOut = () => {
    // Clear user info
    localStorage.setItem(LocalStorageEnum.DISPLAY_NAME, null);
    localStorage.setItem(LocalStorageEnum.UID, null);
    localStorage.setItem(LocalStorageEnum.ADDRESS, null);

    return auth.signOut();
  };

  useEffect(() => {
    setHasXpxAcc(false);
  }, [signUp, googleSignIn, twitterSignIn]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    curAddress,
    setAddress,
    hasXpxAcc,
    setHasXpxAcc,
    emailSignIn,
    googleSignIn,
    twitterSignIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };
