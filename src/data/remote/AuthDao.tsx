import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db,auth } from "../firebaseConfig";
import type { User } from "../../domain/models/User";

export const loginUser = async (
  email: string,
  password: string
): Promise<User| null> => {
  const { user: firebaseUser } = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
  return userDoc.exists() ? (userDoc.data() as User) : null;
};

export const registerUser = async (
  email: string,
  password: string,
  newUser: User
) => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  newUser.uid = firebaseUser.uid;
  await setDoc(doc(db, "users", newUser.uid), newUser);
  return newUser;
};

export const logoutUser = async () => {
  await signOut(auth);
};
