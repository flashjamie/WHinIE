import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ─── 填入你的 Firebase 專案設定 ───────────────────────────────────────────────
// 到 Firebase Console → 專案設定 → 你的應用程式 → 複製 firebaseConfig
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
