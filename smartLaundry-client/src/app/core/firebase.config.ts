// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxWmo9EP4gaaN3G9SIS6XTWXP97p8emmY",
  authDomain: "smart-laundry-d31f3.firebaseapp.com",
  projectId: "smart-laundry-d31f3",
  storageBucket: "smart-laundry-d31f3.firebasestorage.app",
  messagingSenderId: "449810253325",
  appId: "1:449810253325:web:9943a6b21fa7844413b744",
  measurementId: "G-SWQS8YEXTW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);