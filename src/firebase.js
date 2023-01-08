import firebase from "firebase/compat/app";
import "firebase/compat/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCS4TA0H9GWKQfd8MR5MzLmnpaYzAsx8a8",
  authDomain: "olx-clone-baa1d.firebaseapp.com",
  projectId: "olx-clone-baa1d",
  storageBucket: "olx-clone-baa1d.appspot.com",
  messagingSenderId: "497580634971",
  appId: "1:497580634971:web:a0603b1a19d1a41640607e",
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;
