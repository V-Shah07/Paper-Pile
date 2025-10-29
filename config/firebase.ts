import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDRpLe2slCXbxVnavGdZ024A-LcssDP8sE",
  authDomain: "paper-pile-app.firebaseapp.com",
  projectId: "paper-pile-app",
  storageBucket: "paper-pile-app.firebasestorage.app",
  messagingSenderId: "105096721223",
  appId: "1:105096721223:web:683c4b5bd608a05bed9262",
  measurementId: "G-DS7YN8BW7Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;