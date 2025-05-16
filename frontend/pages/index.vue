<template>
  <div class="index">
    <div class="map-overlay">
      <div class="sidebar">
        <div class="flex-row">
        <BaseIcon class="logo icon-lxl" icon="logo_standalone_red" />
        <BaseIcon class="logo" icon="logo_text_long" />
        </div>
        <LocationInput class="mt-1-0" @location-selected="handleLocationSelected" />
        <LocationList :locations="locations" class="mt-1-0" @location-selected="handleLocationSelected" />
      </div>
      <div class = "top-bar">
        <!-- <BaseIcon class="logo" icon="logo_white" /> -->
        <LocationInput @location-selected="handleLocationSelected" />
      </div>
      <div class="info-buttons">
        <div>
          <BaseButton class="primary-inverted" icon="documents" />
          <BaseButton class="primary-inverted mt-0-5" icon="info" />
        </div>
        <BaseButton class="primary-inverted" icon="add" />
      </div>
      <div class = "bottom-bar">
        <LocationSlider :locations="locations" @location-selected="handleLocationSelected" />
      </div>
    </div>
    <LocationMap
      class="map"
      :locations="locations"
      :center="currentCenter"
    />
  </div>
</template>

<script setup lang="ts">
import { GeoPoint } from "@firebase/firestore"
import type { LocationDetails } from "~/types/types"

const { $firestore } = useNuxtApp()
useHead({
  title: "Wasted Spaces",
  meta: [{ name: "", content: "" }]
})

const locations = ref<LocationDetails[]>([])
const currentCenter = ref(new GeoPoint(51.9146308, 4.4709485 )) // Default to Rotterdam
const searchRadius = ref(100) // Default radius in kilometers

const fetchLocations = async () => {
  try {
    locations.value = await $firestore.getLocationsInRadius(
      currentCenter.value.latitude,
      currentCenter.value.longitude,
      searchRadius.value
    )
    console.log("Frontend fetched locations:", locations.value)
  } catch (error) {
    console.error("Error fetching locations:", error)
  }
}

const handleLocationSelected = (latLng: GeoPoint) => {
  console.log("handleLocationSelected", latLng)
  currentCenter.value = latLng

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
  pointer-events: auto;
  height: 100%;
  justify-content: space-between;
  padding: 1rem;
  
  @include for-tablet-landscape-down {
    flex-direction: column;
    padding: 2rem;
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
}
</style>
