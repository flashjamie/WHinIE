import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyAq_uxtaITFGxkmIlG7vlIZ6m8R701Azck",
  authDomain:        "whinie-market.firebaseapp.com",
  projectId:         "whinie-market",
  storageBucket:     "whinie-market.firebasestorage.app",
  messagingSenderId: "17248177025",
  appId:             "1:17248177025:web:a8c9f9fde83e84312e7680",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
