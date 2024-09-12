import { messaging } from './firebase'; // Ensure this import is correct
import { getToken, onMessage } from 'firebase/messaging';

// Ensure your VAPID key is correctly set
const vapidKey = 'BHh7s7QHPF359NPSKhpMsrJOszzf-D8PfJ3LkVScVmuz4dYznsKH3RanJH9aSoxhe5iXEK4gakmWSYsBPUpsoIA';

export const requestForToken = async () => {
  let currentToken = '';

  try {
    currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('Current token for client: ', currentToken);
      // Save this token to your server, or use it to send notifications to this client
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token: ', err);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      resolve(payload);
    }, (err) => {
      console.log('Error receiving message: ', err);
      reject(err);
    });
  });
