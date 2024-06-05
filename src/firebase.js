import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";
import { getStorage } from "firebase/storage";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get and export the DB
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);