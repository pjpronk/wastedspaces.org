<template>
  <div class="index">
    <div class="map-overlay">
      <BaseIcon class="logo" icon="logo_white" />
      <LocationCreate />
      <LocationInput key="2"/>
      <LocationList :locations="locations" class="mt-1-0" />
    </div>
    <LocationMap 
      class="map" 
      :locations="locations"
      @map-center-changed="handleMapCenterChanged"
    />
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from '~/types/types';

const { $firestore } = useNuxtApp();
useHead({
  title: "Kraakkaart",
  meta: [{ name: "", content: "" }]
})

const locations = ref<LocationDetails[]>([]);
const currentCenter = ref({ lat: 51.9146308, lng: 4.4709485 }); // Default to Rotterdam
const searchRadius = ref(10); // Default radius in kilometers

const fetchLocations = async () => {
  try {
    locations.value = await $firestore.getLocationsInRadius(
      currentCenter.value.lat,
      currentCenter.value.lng,
      searchRadius.value
    );
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
};

const handleMapCenterChanged = (center: { lat: number; lng: number }) => {
  currentCenter.value = center;
  fetchLocations();
};

// Initial fetch
fetchLocations();
</script>

<style lang="scss">
.index {
  display: flex;
  flex-direction: row;
}

.map-overlay { 
  background-color: $primary-red;
  overflow: hidden;
  margin: 1.5rem;
  height: calc(100% - 3rem);
  width: 320px;
  padding: 2rem;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9;
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
