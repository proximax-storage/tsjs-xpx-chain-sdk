import React, { useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle } from '../Util/Firebase/FirebaseConfig';

type AuthContextType = {
  signUp: (email: string, password: string) => void;
  emailSignIn: (email: string, password: string) => void;
  googleSignIn: () => void;
  signOut: () => void;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  const signUp = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const emailSignIn = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const googleSignIn = () => {
    return signInWithGoogle();
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
    emailSignIn,
    googleSignIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };
