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
            <div ref="markersContainer">
              <BaseMarker
                v-for="location in staticLocations"
                v-show="visibleLocations.includes(location.id)"
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
            </div>
          </template>
        </BaseMap>
      </template>
    </GoogleMapLoader>
  </div>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore"
import type { LocationDetails } from "~/types/types"
import { useRouter } from "vue-router"

const router = useRouter()

const props = defineProps<{
  locations: LocationDetails[]
  center: GeoPoint
}>()

const emit = defineEmits<{
  (e: 'locationSelected', latLng: GeoPoint): void
}>()

const config = useRuntimeConfig()
const mapRef = ref()
const staticLocations = ref<LocationDetails[]>([])
const visibleLocations = ref<string[]>([])

const mapConfig = {
  center: { lat: props.center.latitude, lng: props.center.longitude },
  mapId: config.public.GOOGLE_MAPS_MAP_ID,
  zoom: 12,
  clickableIcons: false,
  disableDefaultUI: true
}

// Watch for changes in locations to manage visibility
watch(
  () => props.locations,
  (newLocations) => {
    if (!staticLocations.value.length) {
      staticLocations.value = props.locations
    }
    visibleLocations.value = newLocations.map((location) => location.id)
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.map-container {
  position: relative;
}
</style>
