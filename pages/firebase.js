// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBywvIdiu2jV0P0so9VYSSLeXEzzY67zBY",
  authDomain: "yenn-390805.firebaseapp.com",
  projectId: "yenn-390805",
  storageBucket: "yenn-390805.appspot.com",
  messagingSenderId: "664626340135",
  appId: "1:664626340135:web:f2b15eaa516f0c95d64902",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);
const storage = getStorage(app);

export { db };
export { storage };
