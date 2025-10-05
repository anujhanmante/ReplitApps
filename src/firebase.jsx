import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBEvFDvbm072MKU8b7nuaswnU01IVxg_Bc",
  authDomain: "macrotrackerapp-1edda.firebaseapp.com",
  projectId: "macrotrackerapp-1edda",
  storageBucket: "macrotrackerapp-1edda.firebasestorage.app",
  messagingSenderId: "151140066525",
  appId: "1:151140066525:web:dd5a4f4046c90759e82734"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);