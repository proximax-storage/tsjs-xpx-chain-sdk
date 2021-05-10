import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import {
  auth,
  googleProvider,
  twitterProvider,
} from '../Util/Firebase/FirebaseConfig';

type AuthContextType = {
  signUp: (email: string, password: string, username: string) => void;
  emailSignIn: (email: string, password: string) => void;
  googleSignIn: () => any;
  twitterSignIn: () => any;
  signOut: () => void;
  currentUser: any;
  curAddress: string;
  setAddress: (add: string) => void;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [curAddress, setAddress] = useState('');

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);

      return result.user.uid;
    } catch (err) {
      console.log(err);
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    await auth.signInWithEmailAndPassword(email, password);
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
    return auth.signOut();
  };

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
    emailSignIn,
    googleSignIn,
    twitterSignIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };
