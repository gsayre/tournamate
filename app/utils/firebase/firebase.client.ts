import { getApp, getApps, initializeApp } from 'firebase/app';
import {getAuth, connectAuthEmulator, signInWithEmailAndPassword} from 'firebase/auth'
import {getFirestore, connectFirestoreEmulator} from 'firebase/firestore'

let app;
if (getApps().length === 0) {
  app = initializeApp({});
  if (process.env.NODE_ENV === 'development') {
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099');
    const db = getFirestore();
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
} else {
  app = getApp();
}

export const auth = getAuth()
export const db = getFirestore()

export async function signInWithEmail(email:string, password:string) {
    return signInWithEmailAndPassword(auth, email, password)
}

export async function getIdToken() {
    return auth.currentUser?.getIdToken(true)
}

export async function getClientSideUser() {
    return auth.currentUser
}

export const firebaseApp = app