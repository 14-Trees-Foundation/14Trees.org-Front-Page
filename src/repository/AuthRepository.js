import db from "~/repository/db/firebaseInit";
// import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

export default {
  async signIn(email, password) {
    const auth = getAuth();
    let ret = {error: null, user:null}
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      ret.user = userCredential.user;
      // Signed in ...
    } catch(error) {
      ret.error = error
    }
    return ret
  },
  // singinGoogle() {
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider)
  //   .then((result) => {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential.accessToken;
  //     // The signed-in user info.
  //     const user = result.user;
  //     // ...
  //   }).catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.email;
  //     // The AuthCredential type that was used.
  //     const credential = GoogleAuthProvider.credentialFromError(error);
  //     // ...
  //   });
  // },
  async handleAuthChange(handler) {
    const auth = getAuth();
    onAuthStateChanged(auth, handler)

    // const sample_handler = (user) => { 
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/firebase.User
    //     const uid = user.uid;
    //     // ...
    //   } else {
    //     // User is signed out
    //     // ...
    //   }
    // })
  }
};