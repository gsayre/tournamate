import { firestore } from 'firebase-admin';
import type {User} from '~/types'


const converter = <T>() => ({
    toFirestore: (data: Partial<T>) => data,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T
})

const dataPoint = <T>(collectionPath: string) => firestore().collection(collectionPath).withConverter(converter<T>())

const db = {
    currentUser: (uid:string) => dataPoint<User>(`users/${uid}`)
}

const getCurrentUser = async (uid:string) => {
    const userSnap = await db.currentUser(uid).get()
    const userData = userSnap.docs.map((doc) => doc.data())
    return userData
}

const addUser = async (uid: string, firstName: string, lastName: string) => {
    const newUserRef = db.currentUser(uid).doc()
    const newUser: User = {
        uid,
        firstName,
        lastName,
        pastTournaments: [],
        playerRating: 1000,
        statistics: {
            wins: 0,
            loses: 0
    }
    }
    await newUserRef.set(newUser)
}

export {db, getCurrentUser, addUser}