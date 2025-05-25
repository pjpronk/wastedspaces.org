import { initializeApp } from "firebase/app"
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection as firestoreCollection
} from "firebase/firestore"
import type { LocationDetails } from "~/types/types"
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  return {
    provide: {
      db,
      firestore: {
        getDoc: async (collectionName: string, docId: string) => {
          const docRef = doc(db, collectionName, docId)
          const docSnap = await getDoc(docRef)
          return docSnap.exists() ? docSnap.data() : null
        },

        getCollection: async (collectionName: string) => {
          const collectionRef = firestoreCollection(db, collectionName)
          const querySnapshot = await getDocs(collectionRef)
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        },

        getLocations: async () => {
          const collectionRef = firestoreCollection(db, "locations")
          const querySnapshot = await getDocs(collectionRef)
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as LocationDetails[]
        }
      }
    }
  }
})
