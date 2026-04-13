export const environment = {
  production: false,
  
  HASURA_URL: 'http://localhost:8081/v1/graphql',
  BACKEND_URL: 'http://localhost:7072',
  SEND_WELCOME_MAIL_URL: '/api/sendWelcomeMail',
  CONTACT_MAIL: 'stina.boehmig@gmx.de',

  firebaseConfig: {
    apiKey: "AIzaSyBIdSguHqftt5mM3q9o7ZF7SRG4V9rwLHE",
    authDomain: "rememberme-d356c.firebaseapp.com",
    projectId: "rememberme-d356c",
    storageBucket: "rememberme-d356c.firebasestorage.app",
    messagingSenderId: "417866784133",
    appId: "1:417866784133:web:753ab2f24e7f7f5dd338ec",
    measurementId: "G-17WST8M354"
  }
};