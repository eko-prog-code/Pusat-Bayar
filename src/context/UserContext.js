import React, { createContext, useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase'; // Adjust import as needed

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = ref(database, `users/${authUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val() || {};
          setUserData(data);
          setProfilePicUrl(data.profilePicture || '');
          setFullName(data.fullName || 'Anonymous');

          // Update the display name if it's different
          if (authUser.displayName !== data.fullName) {
            updateProfile(authUser, {
              displayName: data.fullName,
            }).catch((error) => console.error('Error updating profile:', error));
          }
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
