import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAvCt-G9Of0mZeqwuGeRdZRo6lH7xzkKmw",
  authDomain: "clone-3c328.firebaseapp.com",
  projectId: "clone-3c328",
  storageBucket: "clone-3c328.appspot.com",
  messagingSenderId: "490517758804",
  appId: "1:490517758804:web:7cf1ae5aea866e2eb07ec1",
  measurementId: "G-5Q2479E8VY",
};

//Initialize the app
const firebaseApp = firebase.initializeApp(firebaseConfig);

//Initialize the Database
const db = firebaseApp.firestore();

//Initialize the Authentication
const auth = firebase.auth();

export { db, auth };
