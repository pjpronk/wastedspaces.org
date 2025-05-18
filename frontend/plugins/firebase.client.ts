import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  collection as firestoreCollection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  GeoPoint,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import type { LocationType, LocationDetails } from '~/types/types';
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return {
    provide: {
      db,
      firestore: {

        // Get a document
        getDoc: async (collectionName: string, docId: string) => {
          const docRef = doc(db, collectionName, docId);
          const docSnap = await getDoc(docRef);
          return docSnap.exists() ? docSnap.data() : null;
        },
        
        // Get all documents from a collection
        getCollection: async (collectionName: string) => {
          const collectionRef = firestoreCollection(db, collectionName);
          const querySnapshot = await getDocs(collectionRef);
          return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        
        // Get locations within a radius (in kilometers)
        getLocations: async () => {
          const collectionRef = firestoreCollection(db, 'locations');
          const querySnapshot = await getDocs(collectionRef);
          return querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })) as LocationDetails[];
        },
        
        // Add a document
        addDoc: async (collectionName: string, data: DocumentData) => {
          const collectionRef = firestoreCollection(db, collectionName);
          const docRef = await addDoc(collectionRef, data);
          return docRef.id;
        },
        
        // Update a document
        updateDoc: async (collectionName: string, docId: string, data: DocumentData) => {
          const docRef = doc(db, collectionName, docId);
          await updateDoc(docRef, data);
        },
        
        // Delete a document
        deleteDoc: async (collectionName: string, docId: string) => {
          const docRef = doc(db, collectionName, docId);
          await deleteDoc(docRef);
        }
      }
    }
  };
});

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
} 