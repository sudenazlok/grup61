import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ⬅️ Firestore'u da ekle

const firebaseConfig = {
  apiKey: "AIzaSyCZ-9p0T6DpzKNMho3iqRb22OhKWZRABv8",
  authDomain: "ai-gorev-listesi.firebaseapp.com",
  projectId: "ai-gorev-listesi",
  storageBucket: "ai-gorev-listesi.firebasestorage.app",
  messagingSenderId: "438288368747",
  appId: "1:438288368747:web:3937df3e3c1ae722d4dd2e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ⬅️ Firestore veritabanını dışa aktar
