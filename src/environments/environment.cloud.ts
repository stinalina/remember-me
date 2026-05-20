export const environment = {
  production: false,

  DICEBEAR_URL: 'https://api.dicebear.com/9.x/adventurer/svg',
  HASURA_URL: 'https://hasura.orangemeadow-efd57554.germanywestcentral.azurecontainerapps.io/v1/graphql',
  HASURA_ADMIN_SECRET: undefined,
  BACKEND_URL: 'https://fa-rememberme-backend-cchucab0bsdpepb5.germanywestcentral-01.azurewebsites.net',
  SEND_WELCOME_MAIL_URL: '/api/sendWelcomeMail',
  CONTACT_MAIL: 'stina.boehmig@gmx.de',
  firebaseAuthEmulator: {
    enabled: false,
    host: '127.0.0.1',
    port: 9099,
  },

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