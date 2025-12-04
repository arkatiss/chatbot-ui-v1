importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js');

if(firebase.messaging.isSupported()){
  console.log('supported');
  firebase.initializeApp({
    apiKey: "AIzaSyAottJCaj2WEWSFhkmS3YkrPOTsOmnJsu8",
    authDomain: "gc-proj-chbt-dev-6090.firebaseapp.com",
    projectId: "gc-proj-chbt-dev-6090",
    storageBucket: "gc-proj-chbt-dev-6090.appspot.com",
    messagingSenderId: "900738314028",
    appId: "1:900738314028:web:b1965aefb52a396f874689",
    measurementId: "G-9EE4KY0PVX"
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {

    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
        })
        .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          windowClient.postMessage(payload);
        }
        })
        .then(() => {
        // return registration.showNotification('You got a new message');
        });
        return promiseChain;
    } else if (/Chrome/i.test(ua)) {
      const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
        })
        .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          windowClient.postMessage(payload);
        }
        })
        .then(() => {
        // return registration.showNotification('You got a new message');
        });
        return promiseChain;
    }
  });
}

