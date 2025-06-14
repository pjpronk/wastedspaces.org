<template>
  <div class="index">
    <div class="map-overlay">
      <div class="sidebar">
        <div class="flex-row">
          <BaseIcon class="logo icon-lxl" icon="logo_standalone_red" />
          <BaseIcon class="logo" icon="logo_text_long" />
        </div>
        <LocationInput
          id="sidebar-input"
          class="mt-1-0"
          @location-selected="handleLocationInput"
        />
        <FilterTabs
          class="mt-1-0"
          model-value="currentFilter"
          @filter-selected="handleFilterSelected"
        />
        <LocationList
          :locations="currentLocations"
          class="mt-1-0"
          @location-selected="handleLocationSelected"
        />
      </div>
      <div class="top-bar">
        <!-- <BaseIcon class="logo" icon="logo_white" /> -->
        <LocationInput
          id="topbar-input"
          @location-selected="handleLocationInput"
        />
      </div>
      <div class="info-buttons">
        <div>
          <BaseButton class="primary-inverted" icon="documents" />
          <BaseButton class="primary-inverted mt-0-5" icon="info" />
        </div>
        <BaseButton
          class="primary-inverted"
          icon="add"
          @click="showLocationCreate = true"
        />
      </div>
      <div class="bottom-bar">
        <LocationSlider
          :locations="currentLocations"
          @location-selected="handleLocationSelected"
        />
      </div>
    </div>
    <Overlay
      v-if="showLocationCreate"
      title="MELD LEEGSTAND"
      @close="showLocationCreate = false"
    >
      <LocationCreate @close="showLocationCreate = false" />
    </Overlay>
    <LocationMap
      class="map"
      :locations="currentLocations"
      :center="currentCenter"
    />
  </div>
</template>

<script setup lang="ts">
import { GeoPoint } from "@firebase/firestore"
import type { LocationDetails, LocationType } from "~/types/types"

const router = useRouter()
const route = useRoute()
const { $firestore } = useNuxtApp() as unknown as {
  $firestore: { getLocations: () => Promise<LocationDetails[]> }
}
useHead({
  title: "Wasted Spaces",
  meta: [{ name: "", content: "" }]
})

const allLocations = ref<LocationDetails[]>([])
const currentLocations = ref<LocationDetails[]>([])
const showLocationCreate = ref(false)
const currentCenter = ref(new GeoPoint(51.9146308, 4.4709485)) // Default to Rotterdam
const currentFilter = ref<LocationType | null>(
  (route.query.filter?.toString().toUpperCase() as LocationType) || null
)
const searchRadius = ref(50) // Default radius in kilometers

const fetchLocations = async () => {
  try {
    allLocations.value = await $firestore.getLocations()
    currentLocations.value = filterLocationsByRadius(allLocations.value)
    currentLocations.value = filterLocationsByType(
      currentLocations.value,
      currentFilter.value
    )
    currentLocations.value = filterLocationByVerificationStatus(currentLocations.value)
  } catch (error) {
    console.error("Error fetching locations:", error)
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

const filterLocationsByRadius = (locations: LocationDetails[]) => {
  // Calculate distances and filter locations within radius
  return locations
    .map((loc: LocationDetails) => ({
      ...loc,
      distance: calculateDistance(
        currentCenter.value.latitude,
        currentCenter.value.longitude,
        loc.latLng.latitude,
        loc.latLng.longitude
      )
    }))
    .filter(
      (loc: LocationDetails & { distance: number }) =>
        loc.distance <= searchRadius.value
    )
    .sort(
      (
        a: LocationDetails & { distance: number },
        b: LocationDetails & { distance: number }
      ) => a.distance - b.distance
    )
}

const filterLocationByVerificationStatus = (locations: LocationDetails[]) => {
  return locations.filter((loc) => loc.verified)
}

const filterLocationsByType = (
  locations: LocationDetails[],
  type: LocationType | null
) => {
  if (!type) return locations
  return locations.filter((location) => location.type === type)
}

const handleLocationSelected = (latLng: GeoPoint) => {
  currentCenter.value = latLng
}

const handleLocationInput = (latLng: GeoPoint) => {
  currentCenter.value = latLng
  currentLocations.value = filterLocationsByRadius(allLocations.value)
  currentLocations.value = filterLocationByVerificationStatus(currentLocations.value)
}

const handleFilterSelected = (filter: LocationType | null) => {
  currentFilter.value = filter
  router.push({
    query: {
      ...route.query,
      filter: filter?.toString().toLowerCase() || undefined
    }
  })
  currentLocations.value = filterLocationsByRadius(allLocations.value)
  currentLocations.value = filterLocationsByType(currentLocations.value, filter)
  currentLocations.value = filterLocationByVerificationStatus(currentLocations.value)
}

// Initial fetch
fetchLocations()
</script>

<style lang="scss">
.index {
  display: flex;
  flex-direction: row;
}
.info-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
  height: 100%;
  justify-content: space-between;
  padding: 1rem;

  @include for-tablet-landscape-down {
    flex-direction: column;
    align-items: flex-end;
    padding: 2rem;
  }

  button {
    pointer-events: auto;
  }
}

.top-bar {
  background-color: $primary-red;
  pointer-events: auto;
  padding: 1rem;
  @include for-tablet-landscape-up {
    display: none;
  }
}

.bottom-bar {
  background-color: $primary-red;
  pointer-events: auto;

  @include for-tablet-landscape-up {
    display: none;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 100%;
  background-color: $primary-red;
  pointer-events: auto;
  padding: 1rem;

  @include for-tablet-landscape-down {
    display: none;
  }
}

.map-overlay {
  overflow: hidden;
  display: flex;
  height: 100%;
  width: 100%;
  z-index: 9;
  pointer-events: none;
  position: absolute;
  justify-content: space-between;

  @include for-tablet-landscape-down {
    flex-direction: column;
    padding: 0px;
  }
}

.map {
  flex: 1;
  height: 100vh;
  width: 100%;
}

.logo {
  width: 80%;
  margin-right: auto;
  fill: $white;
}
</style>
