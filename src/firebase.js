import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA6sANvYoAkXHYG8MjbZl6Pyq23CNdBuzA",
  authDomain: "community-canvas-255fa.firebaseapp.com",
  databaseURL: "https://community-canvas-255fa-default-rtdb.firebaseio.com",
  projectId: "community-canvas-255fa",
  storageBucket: "community-canvas-255fa.appspot.com",
  messagingSenderId: "729445267995",
  appId: "1:729445267995:web:05da6756d66c58b9ccd6be",
  measurementId: "G-FW93CB5QL7"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const rootRef = ref(db, "anisha");
