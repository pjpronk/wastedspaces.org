import { ref } from "vue"
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where
} from "firebase/firestore"
import type { LocationDetails } from "~/types/types"

const { $db } = useNuxtApp()

// Firestore collection reference
const locationsCollection = collection($db, "locations")

// Reactive state
export const locations = ref<LocationDetails[]>([])
export const location = ref<LocationDetails | null>(null)
export const loading = ref<boolean>(false)
export const error = ref<string | null>(null)

/* CREATE */
export async function createLocation(
  locationDetails: LocationDetails
): Promise<LocationDetails | void> {
  try {
    loading.value = true
    error.value = null

    if (
      !locationDetails.address ||
      !locationDetails.city ||
      typeof locationDetails.latitude !== "number" ||
      typeof locationDetails.longitude !== "number"
    ) {
      throw new Error("Missing or invalid required fields")
    }

    const id = crypto.randomUUID() // Generate a unique ID
    const locationRef = doc(locationsCollection, id)
    const newLocation: LocationDetails = { id, ...locationDetails }

    await setDoc(locationRef, newLocation)
    locations.value.push(newLocation)
    console.log("Location created with ID:", id)

    return newLocation
  } catch (err: any) {
    error.value = err.message
    console.error("Error creating location:", err)
  } finally {
    loading.value = false
  }
}

/* READ - Fetch a Single Location */
export async function readLocation(
  locationId: string
): Promise<LocationDetails | undefined> {
  try {
    loading.value = true
    error.value = null

    const locationRef = doc(locationsCollection, locationId)
    const snapshot = await getDoc(locationRef)

    if (!snapshot.exists()) {
      throw new Error("Location not found")
    }

    location.value = snapshot.data() as Location
    return location.value
  } catch (err: any) {
    error.value = err.message
    console.error("Error fetching location:", err)
  } finally {
    loading.value = false
  }
}

/* READ - Fetch Multiple Locations */
export async function readLocations(
  search: string = ""
): Promise<LocationDetails[]> {
  try {
    loading.value = true
    error.value = null

    let locationQuery
    if (search) {
      locationQuery = query(locationsCollection, where("address", ">=", search))
    } else {
      locationQuery = locationsCollection
    }

    const snapshot = await getDocs(locationQuery)
    locations.value = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as LocationDetails
    )

    return locations.value
  } catch (err: any) {
    error.value = err.message
    console.error("Error fetching locations:", err)
    return []
  } finally {
    loading.value = false
  }
}

/* UPDATE */
export async function updateLocation(
  id: string,
  locationUpdates: Partial<Location>
): Promise<void> {
  try {
    loading.value = true
    error.value = null

    const locationRef = doc(locationsCollection, id)
    await updateDoc(locationRef, locationUpdates)

    console.log("Location updated with ID:", id)
    locations.value = locations.value.map((loc) =>
      loc.id === id ? { ...loc, ...locationUpdates } : loc
    )
  } catch (err: any) {
    error.value = err.message
    console.error("Error updating location:", err)
  } finally {
    loading.value = false
  }
}
