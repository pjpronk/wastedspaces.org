<template>
  <div class="full-width">
    <GoogleMapLoader>
      <template #default="{ google }">
        <BaseMap
          :google="google"
          :map-config="mapConfig"
          :center="{ lat: center.latitude, lng: center.longitude }"
        >
          <template #default="{ map }">
            <BaseMarker
              v-for="location in locations"
              :key="location.id"
              :map="map"
              :google="google"
              :position="{
                lat: location.latLng.latitude,
                lng: location.latLng.longitude
              }"
              :title="location.address"
            >
              <LocationInfoWindow :location="location" />
            </BaseMarker>
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

const mapConfig = {
  center: { lat: props.center.latitude, lng: props.center.longitude },
  mapId: config.public.GOOGLE_MAPS_MAP_ID,
  zoom: 12,
  disableDefaultUI: true
}
</script>
