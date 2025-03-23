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
  CollectionReference,
  GeoPoint,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

interface LocationDocument {
  id: string;
  type: 'PRIVAAT' | 'PUBLIEK' | 'COMMERCIEEL' | 'ONBEKEND';
  vacatedSince: Date;
  address: string;
  city: string;
  latLng: GeoPoint;
  createdAt: Date;
  updatedAt: Date;
}

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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return {
    provide: {
      db,
      // Helper functions for common Firestore operations
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
        getLocationsInRadius: async (centerLat: number, centerLng: number, radiusKm: number) => {
          const collectionRef = firestoreCollection(db, 'locations');
          const center = new GeoPoint(centerLat, centerLng);
          
          // Note: This is a simplified version. For production, you should use a more sophisticated
          // geohashing solution or a third-party service like Algolia Places or Google Places API
          // for accurate radius-based queries
          const querySnapshot = await getDocs(collectionRef);
          const locations = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })) as LocationDocument[];
          
          return locations.filter(loc => {
            const distance = calculateDistance(
              centerLat, centerLng,
              loc.latLng.latitude, loc.latLng.longitude
            );
            return distance <= radiusKm;
          });
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

// Helper function to calculate distance between two points using the Haversine formula
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