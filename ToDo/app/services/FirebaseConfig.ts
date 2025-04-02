// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzwh82XytI0SFizbARtPrpBufmpZs5zRY",
  authDomain: "todo-a2fa4.firebaseapp.com",
  projectId: "todo-a2fa4",
  storageBucket: "todo-a2fa4.firebasestorage.app",
  messagingSenderId: "998157730438",
  appId: "1:998157730438:web:a6c4762ff2f09b0949c707",
  measurementId: "G-M9ZGR4EEB5"
};

async function resetConnection() {
  await disableNetwork(db);
  await enableNetwork(db);
}

resetConnection();


// Initialize Firebase
export  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
// const analytics = getAnalytics(app);