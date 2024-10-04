import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuPb5L5XoBXvlI-FYQcws8UxuIzoV8Rco",
  authDomain: "fake-stocks-5587a.firebaseapp.com",
  projectId: "fake-stocks-5587a",
  storageBucket: "fake-stocks-5587a.appspot.com",
  messagingSenderId: "843416322475",
  appId: "1:843416322475:web:a3c7aacf2b5d75ce3f52ee",
  measurementId: "G-K6EMRRBT43",
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}
