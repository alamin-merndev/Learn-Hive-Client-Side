import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import app from "../../Firebase/firebase.config";

export const AuthContext = createContext();
const auth = getAuth(app);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const providerLogin = (provider) => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const verifyEmail = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // if (currentUser === null || currentUser.emailVerified) {
      // }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const [selected, setSelected] = useState({});

  const [allCourses, setAllCourses] = useState([]);
  useEffect(() => {
    fetch("https://leran-hive.elhameduaid.com")
      .then((res) => res.json())
      .then((data) => setAllCourses(data));
  }, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    providerLogin,
    logOut,
    updateUserProfile,
    verifyEmail,
    createUser,
    signIn,
    selected,
    setSelected,
    allCourses,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
