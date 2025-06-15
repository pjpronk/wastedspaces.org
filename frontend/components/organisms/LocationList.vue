<template>
  <div class="location-list">
    <LocationListItem
      v-for="location in locations"
      :key="location.id"
      :location="location"
      @location-selected="handleLocationSelected"
    />
  </div>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore"
import type { LocationDetails } from "~/types/types"

defineProps<{
  locations: LocationDetails[]
}>()

const emit = defineEmits<{
  (e: "locationSelected", latLng: GeoPoint): void
}>()

const handleLocationSelected = (latLng: GeoPoint) => {
  emit("locationSelected", latLng)
}
</script>

<style scoped lang="scss">
.location-list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: 8px;
  padding-right: 8px;
}
</style>
