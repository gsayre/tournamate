import { getFirestore } from 'firebase-admin/firestore';
import type { User } from '~/types';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  getFirestore().collection(collectionPath).withConverter(converter<T>());

const db = {
  users: dataPoint<User>(`users`),
};

export const getCurrentUser = async (uid: string) => {
  const userSnap = await db.users.doc(uid).get();
  const userData = userSnap.data();
  return userData;
};

export const addUser = async (
  uid: string,
  firstName: string,
  lastName: string
) => {
  const newUser: User = {
    uid,
    firstName,
    lastName,
    pastTournaments: [],
    playerRating: 1000,
    statistics: {
      wins: 0,
      loses: 0,
    },
  };
  await db.users.doc(uid).set(newUser);
};
