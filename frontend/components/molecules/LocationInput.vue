<template>
  <div class="location-input">
    <GoogleMapLoader>
      <template #default="{ google }">
        <BaseLocationInput @locationSelected="handleLocationSelected" :value="value" :google="google" />
      </template>
    </GoogleMapLoader>
  </div>
</template>

<script setup lang="ts">
import { GeoPoint } from 'firebase/firestore'

const props = defineProps({
  value: {
    type: String,
    default: ""
  }
})

const emit = defineEmits<{
  (e: 'locationSelected', latLng: GeoPoint): void
}>()

const handleLocationSelected = (latLng: GeoPoint) => {
  emit("locationSelected", latLng)
}
</script>

<style scoped lang="scss">
.location-input {
  width: 100%;
}
</style>
