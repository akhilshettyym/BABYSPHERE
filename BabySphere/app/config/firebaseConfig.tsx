import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Firestore import
import { getStorage } from 'firebase/storage'; // Storage import if needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuOGFzm5mhD_zFmv_SrTUB3Q3_bSYfqgQ",
  authDomain: "babymonitor-1f698.firebaseapp.com",
  projectId: "babymonitor-1f698",
  storageBucket: "babymonitor-1f698.appspot.com",
  messagingSenderId: "972580959918",
  appId: "1:972580959918:web:d2150389843163f9971f3f",
  measurementId: "G-08D1NRCS3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage (if you're using Firebase Storage as well)
const storage = getStorage(app);

export { db, storage };
