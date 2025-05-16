<template>
    <div class="location-slider">
      <LocationCard
        v-for="location in locations"
        :key="location.latLng.latitude + ',' + location.latLng.longitude"
        :location="location"
        @locationSelected="handleLocationSelected"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import type { GeoPoint } from "@firebase/firestore";
  import type { LocationDetails } from "~/types/types"
  
  const props = defineProps<{
    locations: LocationDetails[]
  }>();
  
  const emit = defineEmits<{
    (e: 'locationSelected', latLng: GeoPoint): void
  }>();
  
  const handleLocationSelected = (latLng: GeoPoint) => {
    emit('locationSelected', latLng);
  };
  </script>
  
  <style scoped lang="scss">
  .location-slider {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    gap: 8px;
    padding: 1rem;
  }
  </style>
  