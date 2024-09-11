import { initializeApp } from "firebase/app";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth"; // Tambahkan signOut
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBKKZRkZdTLmp8donTMMPXiBavBCeHB5P8",
  authDomain: "pusatbayar-innoview.firebaseapp.com",
  projectId: "pusatbayar-innoview",
  storageBucket: "pusatbayar-innoview.appspot.com",
  messagingSenderId: "2635613313",
  appId: "1:2635613313:web:e8c94bc1b53e02533eb980"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Request FCM Token
export const requestForToken = () => {
  return getToken(messaging, { vapidKey: "PF359NPSKhpMsrJOszzf-D8PfJ3LkVScVmuz4dYznsKH3RanJH9aSoxhe5iXEK4gakmWSYsBPUpsoIA" })  // Replace with your VAPID key
    .then((currentToken) => {
      if (currentToken) {
        console.log('Current token for client: ', currentToken);
        // Here you can send the token to your server or save it to database
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

// Listen to messages when app is in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { auth, database, storage, messaging, firebaseSignOut as signOut }; // Tambahkan signOut