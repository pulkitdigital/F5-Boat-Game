// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOz_UOHcOvHmIqYJ1Frtcw2eapT-PP-HQ",
  authDomain: "f5-boat-game.firebaseapp.com",
  databaseURL: "https://f5-boat-game-default-rtdb.firebaseio.com",
  projectId: "f5-boat-game",
  storageBucket: "f5-boat-game.firebasestorage.app",
  messagingSenderId: "897654640442",
  appId: "1:897654640442:web:0b33e76f6647b7b7160a03",
  measurementId: "G-X7YK6DTS32",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);