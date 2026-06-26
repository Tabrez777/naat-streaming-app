import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArhwQ2oOt1o1igrxcd3h57gVw32kvUiro",
  authDomain: "tez-music-app.firebaseapp.com",
  projectId: "tez-music-app",
  storageBucket: "tez-music-app.firebasestorage.app",
  messagingSenderId: "835722741923",
  appId: "1:835722741923:web:ac5cac435222e7cd319716",
  measurementId: "G-WFJ67V3FY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools so your app can use them
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();