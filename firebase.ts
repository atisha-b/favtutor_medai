// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-RgvEpDO7hP7cjrqHeDGsfl_7uSztb98",
    authDomain: "medai-123.firebaseapp.com",
    projectId: "medai-123",
    storageBucket: "medai-123.appspot.com",
    messagingSenderId: "68141765516",
    appId: "1:68141765516:web:a6e878bad77f5cc7b9fca9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {app, db,storage, auth}
