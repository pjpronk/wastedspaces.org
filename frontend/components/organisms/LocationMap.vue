<template>
  <div class="full-width">
    <GoogleMapLoader>
      <template v-slot="{ google }">
        <BaseMap 
          :google="google" 
          :mapConfig="mapConfig"
          :center="center"
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

const props = defineProps<{
  locations: LocationDetails[]
  center: { lat: number; lng: number }
}>()

const emit = defineEmits<{
  (e: 'map-center-changed', center: { lat: number; lng: number }): void
}>()

const mapRef = ref(null)
const config = useRuntimeConfig();

const mapConfig = {
  center: props.center,
  mapId: config.public.GOOGLE_MAPS_MAP_ID,
  zoom: 12,
  disableDefaultUI: true,
}

const handleCenterChanged = (center: { lat: number; lng: number }) => {
  emit('map-center-changed', center);
}

onMounted(() => {
  console.log(mapRef.value)
})
</script>
