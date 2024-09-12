import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from '../firebase/firebase'; // Firebase auth and database
import { ref, onValue } from 'firebase/database';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = ref(database, `users/${authUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val() || {};
          setUserData(data);
          setProfilePicUrl(data.profilePicture || '');
          setFullName(data.fullName || 'Anonymous');
        });
      } else {
        setUser(null);
        setUserData({});
        setProfilePicUrl('');
        setFullName('Anonymous');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, profilePicUrl, fullName, setProfilePicUrl }}>
      {children}
    </UserContext.Provider>
  );
};