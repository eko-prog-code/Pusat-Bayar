import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from '../firebase/firebase'; // Import Firebase modules if needed
import { ref, onValue } from 'firebase/database';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [profilePicUrl, setProfilePicUrl] = useState(''); // Initialize the profile picture URL

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = ref(database, `users/${authUser.uid}`);
        onValue(userRef, (snapshot) => {
          setUserData(snapshot.val() || {});
        });
      } else {
        setUser(null);
        setUserData({});
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, profilePicUrl, setProfilePicUrl }}>
      {children}
    </UserContext.Provider>
  );
};