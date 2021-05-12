import React, { useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../Util/Firebase/FirebaseConfig';

type AuthContextType = {
  signUp: (email: string, password: string, username: string) => void;
  emailSignIn: (email: string, password: string) => void;
  googleSignIn: () => any;
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
    try {
      const result = await auth.signInWithPopup(googleProvider);
      const isNewUser = result.additionalUserInfo.isNewUser;

      return {
        uid: result.user.uid,
        email: result.user.email,
        username: result.user.displayName,
        isNewUser: isNewUser,
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, [currentUser]);

  const value = {
    currentUser,
    curAddress,
    setAddress,
    emailSignIn,
    googleSignIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };
