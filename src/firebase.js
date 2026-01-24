import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiPAKGpJopnj1pcPfAHfkcMDqilE8cpR8",
  authDomain: "clienthub-saas.firebaseapp.com",
  projectId: "clienthub-saas",
  storageBucket: "clienthub-saas.firebasestorage.app",
  messagingSenderId: "680460381882",
  appId: "1:680460381882:web:b8da71f1cdabdb05655c83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);