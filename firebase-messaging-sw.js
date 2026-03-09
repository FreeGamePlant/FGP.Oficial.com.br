importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAJmGpsYPA_hT-qsuG7lwRTo05KU32e16E",
  authDomain: "fgp-platform.firebaseapp.com",
  projectId: "fgp-platform",
  messagingSenderId: "1020812354313",
  appId: "1:1020812354313:web:cd88f088ebfc293cbca9d8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/FGP.Oficial.com.br/src/assets/images/lOGOFGP.png"
  });
});
