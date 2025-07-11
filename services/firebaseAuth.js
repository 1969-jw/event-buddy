import { auth } from "../firebaseConfig";

export const signUp = async (email, password) => {
  return await auth.createUserWithEmailAndPassword(email, password);
};

export const signIn = async (email, password) => {
  return await auth.signInWithEmailAndPassword(email, password);
};
