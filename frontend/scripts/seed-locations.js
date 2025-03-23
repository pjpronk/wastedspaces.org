import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, GeoPoint } from 'firebase/firestore';
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

const sampleLocations = [
  // Delft locations
  {
    type: 'PRIVAAT',
    vacatedSince: new Date('2024-01-15'),
    address: 'Oude Delft 1',
    city: 'Delft',
    location: new GeoPoint(52.0115, 4.3571),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'COMMERCIEEL',
    vacatedSince: new Date('2024-02-01'),
    address: 'Phoenixstraat 28',
    city: 'Delft',
    location: new GeoPoint(52.0087, 4.3608),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'PUBLIEK',
    vacatedSince: new Date('2024-03-01'),
    address: 'Brabantse Turfmarkt 1',
    city: 'Delft',
    location: new GeoPoint(52.0121, 4.3589),
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // The Hague locations
  {
    type: 'COMMERCIEEL',
    vacatedSince: new Date('2024-01-20'),
    address: 'Lange Poten 4',
    city: 'Den Haag',
    location: new GeoPoint(52.0777, 4.3167),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'PRIVAAT',
    vacatedSince: new Date('2024-02-15'),
    address: 'Noordeinde 68',
    city: 'Den Haag',
    location: new GeoPoint(52.0822, 4.3107),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'PUBLIEK',
    vacatedSince: new Date('2024-03-10'),
    address: 'Plein 23',
    city: 'Den Haag',
    location: new GeoPoint(52.0797, 4.3177),
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Amsterdam locations
  {
    type: 'COMMERCIEEL',
    vacatedSince: new Date('2024-01-25'),
    address: 'Damstraat 12',
    city: 'Amsterdam',
    location: new GeoPoint(52.3731, 4.8925),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'PRIVAAT',
    vacatedSince: new Date('2024-02-20'),
    address: 'Herengracht 124',
    city: 'Amsterdam',
    location: new GeoPoint(52.3747, 4.8882),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'PUBLIEK',
    vacatedSince: new Date('2024-03-15'),
    address: 'Rokin 42',
    city: 'Amsterdam',
    location: new GeoPoint(52.3702, 4.8912),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedLocations() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log(`Starting to seed ${sampleLocations.length} locations...`);

    // Add each location to Firestore
    for (const location of sampleLocations) {
      try {
        await addDoc(collection(db, 'locations'), location);
        console.log(`Added location: ${location.address}, ${location.city}`);
      } catch (error) {
        console.error(`Error adding location ${location.address}:`, error);
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

// Run the seeding
seedLocations(); 