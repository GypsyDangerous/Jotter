import firebase from "firebase"
import "firebase/auth"



const config = {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    authDomain: "jotter-2.firebaseapp.com",
    databaseURL: "https://jotter-2.firebaseio.com",
    projectId: "jotter-2",
    storageBucket: "jotter-2.appspot.com",
    messagingSenderId: "114745109987",
    appId: "1:114745109987:web:f2c5e3245c1243ba1f04d6",
    measurementId: "G-LEPQ56MCQW"
};
// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();


export default firebase
