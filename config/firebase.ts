import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRpLe2slCXbxVnavGdZ024A-LcssDP8sE",
  authDomain: "paper-pile-app.firebaseapp.com",
  projectId: "paper-pile-app",
  storageBucket: "paper-pile-app.firebasestorage.app",
  messagingSenderId: "105096721223",
  appId: "1:105096721223:web:683c4b5bd608a05bed9262",
  measurementId: "G-DS7YN8BW7Q"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth (simplified - will work but won't persist as well)
export const auth = getAuth(app);

// Initialize other services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;