<template>
  <div class="full-width map-container">
    <GoogleMapLoader>
      <template #default="{ google }">
        <BaseMap
          ref="mapRef"
          :google="google"
          :map-config="mapConfig"
          :center="{ lat: center.latitude, lng: center.longitude }"
        >
          <template #default="{ map }">
            <BaseMarker
              v-for="location in locations"
              :key="location.id"
              :map="map"
              :location="location"
              :google="google"
              :position="{
                lat: location.latLng.latitude,
                lng: location.latLng.longitude
              }"
              :title="location.address"
            />
          </template>
        </BaseMap>
      </template>
    </GoogleMapLoader>
  </div>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore"
import type { LocationDetails } from "~/types/types"

const props = defineProps<{
  locations: LocationDetails[]
  center: GeoPoint
}>()

const config = useRuntimeConfig()
const mapRef = ref()

const mapConfig = {
  center: { lat: props.center.latitude, lng: props.center.longitude },
  mapId: config.public.GOOGLE_MAPS_MAP_ID,
  zoom: 12,
  disableDefaultUI: true
}
</script>

<style scoped lang="scss">
.map-container {
  position: relative;
}
</style>
