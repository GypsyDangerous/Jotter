import firebase from "firebase"
import "firebase/auth"
require('dotenv').config()

const config = {
    apiKey: "AIzaSyCboAL_a92MBMnCGlV0VYb4Ui2WZUtxBTc",
    authDomain: "jotter-8c0cd.firebaseapp.com",
    databaseURL: "https://jotter-8c0cd.firebaseio.com",
    projectId: "jotter-8c0cd",
    storageBucket: "jotter-8c0cd.appspot.com",
    messagingSenderId: "517406836732",
    appId: "1:517406836732:web:0ae80dd8cc94a33220d479",
    measurementId: "G-S0FXZKJBQ9"
};
// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

console.log(process.env)

export default firebase
