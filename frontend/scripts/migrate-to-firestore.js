import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, GeoPoint } from 'firebase/firestore';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

async function migrateData() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Fetch data from your current API
    const response = await fetch(`${process.env.BACKEND_URL}/locations`);
    const locations = await response.json();

    console.log(`Found ${locations.length} locations to migrate`);

    // Migrate each location to Firestore
    for (const location of locations) {
      try {
        await addDoc(collection(db, 'locations'), {
          type: location.type,
          vacatedSince: location.vacatedSince,
          address: location.address,
          city: location.city,
          location: new GeoPoint(location.latitude, location.longitude),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Migrated location: ${location.address}`);
      } catch (error) {
        console.error(`Error migrating location ${location.address}:`, error);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateData(); 