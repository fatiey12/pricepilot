importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB24X9hIYcIX8XtVn50awbT19lyWnrblyM",
  authDomain: "pricepilot-27f47.firebaseapp.com",
  projectId: "pricepilot-27f47",
  messagingSenderId: "1093255677377",
  appId: "1:1093255677377:web:e8de3e5225785840241b40"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});