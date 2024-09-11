// Import scripts for Firebase
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBKKZRkZdTLmp8donTMMPXiBavBCeHB5P8",
  authDomain: "pusatbayar-innoview.firebaseapp.com",
  projectId: "pusatbayar-innoview",
  storageBucket: "pusatbayar-innoview.appspot.com",
  messagingSenderId: "2635613313",
  appId: "1:2635613313:web:e8c94bc1b53e02533eb980"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});