// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVl_M7sCnizH7YT-i8zJytNg4t2V5kXY4",
  authDomain: "pchatdb.firebaseapp.com",
  databaseURL: "https://pchatdb-default-rtdb.firebaseio.com",
  projectId: "pchatdb",
  storageBucket: "pchatdb.appspot.com",
  messagingSenderId: "889763873237",
  appId: "1:889763873237:web:20feeb10e6d338ddbd3d5c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(function () {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
