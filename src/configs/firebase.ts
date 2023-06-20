import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsqHzr3rLYhpthm54YetOV6vDkM2wd_aE",
  authDomain: "savelink-fe254.firebaseapp.com",
  projectId: "savelink-fe254",
  storageBucket: "savelink-fe254.appspot.com",
  messagingSenderId: "736223480816",
  appId: "1:736223480816:web:26d9bd1db952f866146b35",
  measurementId: "G-7BXN1RR1TD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Auth1 = getAuth(app)
export {
db, Auth1
}


