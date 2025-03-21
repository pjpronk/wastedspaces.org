<template>
  <div class="full-width">
    <GoogleMapLoader>
      <template v-slot="{ google }">
        <BaseMap 
          :google="google" 
          :mapConfig="mapConfig"
          @center-changed="handleCenterChanged"
        >
          <template v-slot="{ map }">
            <BaseMarker
              v-for="location in locations"
              :map="map"
              :google="google"
              :position="{ 
                lat: location.location.latitude, 
                lng: location.location.longitude 
              }"
              :title="location.address"
              :key="location.id"
            >
              <LocationInfoWindow :location="location"/>
            </BaseMarker>
          </template>
        </BaseMap>
      </template>
    </GoogleMapLoader>
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"

defineProps<{
  locations: LocationDetails[]
}>()

const emit = defineEmits<{
  (e: 'map-center-changed', center: { lat: number; lng: number }): void
}>()

const config = useRuntimeConfig();

const mapConfig = {
  center: { lat: 51.9146308, lng: 4.4709485 },
  mapId: config.public.GOOGLE_MAPS_MAP_ID,
  zoom: 12,
  disableDefaultUI: true,
}

const handleCenterChanged = (center: { lat: number; lng: number }) => {
  emit('map-center-changed', center);
}
</script>
