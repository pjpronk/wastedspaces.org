<template>
  <div class="full-width">
    <GoogleMapLoader>
      <template v-slot="{ google }">
        <BaseMap 
          :google="google" 
          :mapConfig="mapConfig"
          :center="{ lat: center.latitude, lng: center.longitude }"
        >
          <template v-slot="{ map }">
            <BaseMarker
              v-for="location in locations"
              :map="map"
              :google="google"
              :position="{ 
                lat: location.latLng.latitude, 
                lng: location.latLng.longitude 
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
import type { GeoPoint } from "@firebase/firestore";
import type { LocationDetails } from "~/types/types"

const props = defineProps<{
  locations: LocationDetails[]
  center: GeoPoint
}>()

const mapRef = ref(null)
const config = useRuntimeConfig();

const mapConfig = {
  center: {lat: props.center.latitude, lng: props.center.longitude},
  mapId: config.public.GOOGLE_MAPS_MAP_ID,
  zoom: 12,
  disableDefaultUI: true,
}

onMounted(() => {
  console.log(mapRef.value)
})
</script>
