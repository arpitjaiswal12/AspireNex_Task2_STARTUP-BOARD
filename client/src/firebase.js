// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "aspirenextask.firebaseapp.com",
  projectId: "aspirenextask",
  storageBucket: "aspirenextask.appspot.com",
  messagingSenderId: "622433837317",
  appId: "1:622433837317:web:9a6a4ed7fadff60a90976c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);