<template>
  <div class="location-list">
    <LocationListItem
      v-for="location in locations"
      :key="location.latLng.latitude + ',' + location.latLng.longitude"
      :location="location"
    />
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"

// Sample array of location details
const locations = ref<LocationDetails[]>([
  {
    address: "123 Main St",
    latLng: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    name: "Location 1",
    country: "USA",
    locality: "San Francisco"
  },
  {
    address: "456 Market St",
    latLng: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    name: "Location 2",
    country: "USA",
    locality: "Los Angeles"
  }
  // Add more locations as needed
])
</script>

<style scoped lang="scss">
.location-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: $grey;
}
</style>
