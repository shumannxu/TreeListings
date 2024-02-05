import { auth, firestore } from "../firebaseConfig";
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const registerUserEmailPassword = async (
  email: string,
  password: string,
  fullName: string
) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((response) => {
      // Signed in
      const user = response.user;
      if (!user.emailVerified) {
        // Send email verification first
        return sendEmailVerification(user)
          .then(() => {
            // Email verification sent
            console.log("Verification email sent.");
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            return AsyncStorage.setItem("emailForSignIn", email);
          })
          .then(() => {
            // After verification email is sent, save user data to firestore
            const uid = user.uid;
            const data = {
              id: uid,
              email,
              fullName,
            };
            const usersRef = collection(firestore, "users");
            const userDoc = doc(usersRef, uid);
            return setDoc(userDoc, data);
          })
          .catch((error) => {
            // Error occurred in sending email verification or saving user data
            console.error(error);
            alert(error.message);
          });
      }
    })
    .catch((error) => {
      // Error occurred in creating user with email and password
      console.error(error);
      alert(error.message);
    });
};

const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((response) => {
      const user = response.user;
      if (!user.emailVerified) {
        alert("Email is not yet Verfied");
      } else {
        const uid = response.user.uid;
        const userDocRef = doc(firestore, "users", uid);
        getDoc(userDocRef)
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists()) {
              alert("User does not exist anymore.");
              return;
            }
          })
          .catch((error) => {
            alert(error);
          });
      }
    })

    .catch((error) => {
      alert(error);
    });
};
export { registerUserEmailPassword, signIn };
