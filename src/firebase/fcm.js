import { messaging } from './firebase'; // Pastikan import dari file firebase.js yang sudah diinisialisasi
import { getToken, onMessage } from 'firebase/messaging';

export const requestForToken = async () => {
  let currentToken = '';

  try {
    currentToken = await getToken(messaging, { vapidKey: 'PF359NPSKhpMsrJOszzf-D8PfJ3LkVScVmuz4dYznsKH3RanJH9aSoxhe5iXEK4gakmWSYsBPUpsoIA' });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      // Save this token to your server, or use it to send notifications to this client
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });