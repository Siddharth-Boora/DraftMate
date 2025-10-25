import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBk8BgTVWFlflCPqRAwLDsvS_rhTGxUZ90",
  authDomain: "draftmate-4e719.firebaseapp.com",
  projectId: "draftmate-4e719",
  storageBucket: "draftmate-4e719.firebasestorage.app",
  messagingSenderId: "732142293809",
  appId: "1:732142293809:web:3f7dbdfa5f936d6f369610"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
