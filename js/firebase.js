import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDE4YguzNfry7-zD9C992q2WCeR4G3CS7c",
  authDomain: "breathskate-e3e30.firebaseapp.com",
  projectId: "breathskate-e3e30",
  storageBucket: "breathskate-e3e30.firebasestorage.app",
  messagingSenderId: "891685105645",
  appId: "1:891685105645:web:81ac5e0f78d46db85241e4"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
