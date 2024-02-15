import { auth, firestore } from "../firebaseConfig";
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../types";

const registerUserEmailPassword = async (
  email: string,
  password: string,
  fullName: string
): Promise<void> => {
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
            const data: User = {
              id: uid,
              email,
              fullName,
              dateCreated: new Date(),
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

const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const user = response.user;

    if (!user.emailVerified) {
      alert(
        "Email is not yet Verified. Check Your Email For a New Email Confirmation"
      );
      sendEmailVerification(user).then(() => {
        // Email verification sent
        console.log("Verification email sent.");
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        return AsyncStorage.setItem("emailForSignIn", email);
      });
      return null;
    } else {
      const uid = user.uid;
      const userDocRef = doc(firestore, "users", uid);
      const firestoreDocument = await getDoc(userDocRef);
      if (!firestoreDocument.exists()) {
        alert("User does not exist anymore.");
        return null;
      }
      const userData = firestoreDocument.data();
      userData.dateCreated = userData.dateCreated.toDate();
      AsyncStorage.setItem("userInfo", JSON.stringify(userData));
      return userData as User;
    }
  } catch (error) {
    alert(error);
    return null;
  }
};

const signOutUser = (): Promise<void> => {
  return signOut(auth);
};
export { registerUserEmailPassword, signIn, signOutUser };
