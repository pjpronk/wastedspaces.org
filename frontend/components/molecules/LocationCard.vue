<template>
  <div class="location-card" @click="handleClick">
    <BaseImage
      :image="streetViewUrl"
      alt="Location Street View"
      class="location-image"
    />
    <LocationListItem :location="location" />
  </div>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore"
import type { LocationDetails } from "~/types/types"

const config = useRuntimeConfig()

const props = defineProps<{
  location: LocationDetails
}>()

const emit = defineEmits<{
  (e: "locationSelected", latLng: GeoPoint): void
}>()

const handleClick = () => {
  emit("locationSelected", props.location.latLng)
}

const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&key=${config.public.GOOGLE_MAPS_API_KEY}&location=${props.location.latLng.latitude},${props.location.latLng.longitude}`
</script>

<style scoped lang="scss">
.location-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: $white;
  padding: 1rem;
}

.location-image {
  width: 100%;
  min-width: 200px;
  height: 120px;
  object-fit: cover;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
}

.card-info {
  width: 100%;
  padding: 1rem;
}
</style>
