import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  addDoc,
  GeoPoint,
  getDocs,
  deleteDoc
} from "firebase/firestore"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const sampleLocations = [
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-18"),
    address: "Kortenaerstraat 12",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9137197, 4.4780767),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-07-07"),
    address: "Puntstraat 36",
    city: "Rotterdam",
    latLng: new GeoPoint(51.90845, 4.4405534),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-16"),
    address: "Dirk Danestraat 58",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9138646, 4.4346061),
    createdAt: new Date(),
    updatedAt: new Date()
  },

  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-04-28"),
    address: "Van Beuningenstraat 20c",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9290768, 4.4579758),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-17"),
    address: "Meidoornstraat 71C",
    city: "Rotterdam",
    latLng: new GeoPoint(51.935437, 4.4828273),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-17"),
    address: "Stieltjesplein 4",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9123808, 4.4996891),
    createdAt: new Date(),
    updatedAt: new Date()
  },

  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-17"),
    address: "Nassaukade 36",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9125413, 4.4997493),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-17"),
    address: "Nassaukade 35",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9124653, 4.4994629),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-08-01"),
    address: "R. H. Fledderusstraat 12",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9065537, 4.5029977),
    createdAt: new Date(),
    updatedAt: new Date()
  },

  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-04-24"),
    address: "Oostmaasstraat 28",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9235792, 4.5094266),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-03-19"),
    address: "Ebalstraat 14C",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9320586, 4.5041237),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-03-19"),
    address: "Ebalstraat 14B",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9320768, 4.5041525),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-03-19"),
    address: "Ebalstraat 14A",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9320945, 4.504123),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-03-19"),
    address: "Ebalstraat 13B",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9321217, 4.5041515),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-03-19"),
    address: "Ebalstraat 13A",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9321399, 4.5041803),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-03-19"),
    address: "Ebalstraat 13C",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9321579, 4.5041799),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-17"),
    address: "Vondelweg 89",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9268459, 4.4883881),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-19"),
    address: "Noordsingel 197",
    city: "Rotterdam",
    latLng: new GeoPoint(51.933004, 4.473076),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-19"),
    address: "Noordsingel 199",
    city: "Rotterdam",
    latLng: new GeoPoint(51.933027, 4.473013),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: "RESIDENTIAL",
    ownership: "UNKNOWN",
    vacatedSince: new Date("2024-10-19"),
    address: "Bergweg 278A",
    city: "Rotterdam",
    latLng: new GeoPoint(51.9332273, 4.4731522),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedLocations() {
  try {
    // Initialize Firebase
    console.log("Initializing Firebase...")
    console.log(firebaseConfig)
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log("Starting to clear existing locations...")

    // Get all documents in the locations collection
    const locationsRef = collection(db, "locations")
    const snapshot = await getDocs(locationsRef)

    // Delete each document
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    console.log(`Cleared ${snapshot.size} existing locations`)

    console.log(`Starting to seed ${sampleLocations.length} locations...`)

    // Add each location to Firestore
    for (const location of sampleLocations) {
      try {
        await addDoc(collection(db, "locations"), location)
        console.log(`Added location: ${location.address}, ${location.city}`)
      } catch (error) {
        console.error(`Error adding location ${location.address}:`, error)
      }
    }

    console.log("Seeding completed successfully")
  } catch (error) {
    console.error("Seeding failed:", error)
  }
}

// Run the seeding
seedLocations()
