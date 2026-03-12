// src/store/gameStore.js
import { db } from "../firebase/firebaseConfig";
import { ref, set, onValue, off } from "firebase/database";

export const QUESTION_COUNT = 20;
export const MAX_SCORE = 2000;
export const SCORES_REF = "rowing_boat/scores";

export const F5_RED = "#E4002B";
export const F5_RED_DARK = "#B8001F";
export const F5_RED_LIGHT = "#FF1A3C";

export const emptyScores = () => Array(QUESTION_COUNT).fill("");

// Save scores to Firebase Realtime DB (frontend only)
export async function saveScores(scores) {
  await set(ref(db, SCORES_REF), scores);
}

// Reset scores in Firebase
export async function resetScores() {
  await set(ref(db, SCORES_REF), emptyScores());
}

// Subscribe to live score updates from Firebase
// Returns unsubscribe function
export function subscribeScores(callback) {
  const scoresRef = ref(db, SCORES_REF);
  onValue(scoresRef, (snapshot) => {
    const data = snapshot.val();
    if (Array.isArray(data)) {
      callback(data);
    } else {
      callback(emptyScores());
    }
  });
  return () => off(scoresRef);
}

export const calcTotal = (s) =>
  s.reduce((sum, v) => sum + (v !== "" && v !== null ? Number(v) : 0), 0);

export const calcFilled = (s) =>
  s.filter((v) => v !== "" && v !== null).length;

export const calcProgress = (total) =>
  Math.min((total / MAX_SCORE) * 100, 100);