import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });

    console.log("FCM TOKEN:", token);
    return token;

  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
};

export const listenForMessages = (setMessage) => {
  console.log("Listener started");

  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);

    alert("Notification received");

    const title =
      payload.notification?.title ||
      payload.data?.title ||
      "PricePilot";

    const body =
      payload.notification?.body ||
      payload.data?.body ||
      "New notification received";

    setMessage(`${title}: ${body}`);

    setTimeout(() => {
      setMessage("");
    }, 5000);
  });
};