import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA1IIGu8i9nLJZ7NZoCcBEbx5afnL7LafA",
  authDomain: "blog-website-d4e46.firebaseapp.com",
  projectId: "blog-website-d4e46",
  storageBucket: "blog-website-d4e46.firebasestorage.app",
  messagingSenderId: "771626108510",
  appId: "1:771626108510:web:f8079db8c41c3eb99356cf"
};

const app = initializeApp(firebaseConfig);


// google auth setup
const provider = new GoogleAuthProvider();
const auth = getAuth();


export const authWithGoogle = async () => {

    let user = null;

    await signInWithPopup(auth, provider)
    .then ((result) => {
        user = result.user
    })

    .catch((err) => {
        console.log(err)
    })

    return user;
}