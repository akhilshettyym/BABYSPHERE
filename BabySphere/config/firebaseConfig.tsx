import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Firestore import
import { getStorage } from 'firebase/storage'; // Storage import if needed
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV0bsuW8kRIyYe5cPXyxW_GTuL_aK4rXU",
  authDomain: "babysphere-3d697.firebaseapp.com",
  projectId: "babysphere-3d697",
  storageBucket: "babysphere-3d697.firebasestorage.app",
  messagingSenderId: "218539208823",
  appId: "1:218539208823:web:fe80a4b4089dab57b89672",
  measurementId: "G-FDDLLS5RVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage (if you're using Firebase Storage as well)
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage,auth}