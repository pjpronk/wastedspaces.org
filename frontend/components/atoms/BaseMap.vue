<template>
  <div ref="mapContainer" class="map" />
  <template v-if="map">
    <slot :map="map" />
  </template>
</template>

<script setup lang="ts">
const props = defineProps<{
  google: typeof google
  mapConfig: google.maps.MapOptions
  center: { lat: number; lng: number }
}>()

const mapContainer = ref(null)
const map = ref<google.maps.Map | null>(null)

onMounted(async () => {
  try {
    if (mapContainer.value) {
      map.value = new props.google.maps.Map(mapContainer.value, props.mapConfig)
    }
  } catch (error) {
    console.error("Error loading map: ", error)
  }
})

watch(
  () => props.center,
  (newCenter) => {
    if (map.value) {
      // Convert pixel offset to lat/lng offset
      const scale = Math.pow(2, map.value.getZoom() || 0)
      const projection = map.value.getProjection()
      if (projection) {
        const centerPoint = projection.fromLatLngToPoint(
          new props.google.maps.LatLng(newCenter)
        )
        if (centerPoint) {
          // Apply pixel offsets (75px right, 100px up)
          centerPoint.x += 120 / scale
          centerPoint.y -= 140 / scale // Subtract because y increases downward
          const offsetCenter = projection.fromPointToLatLng(centerPoint)
          if (offsetCenter) {
            map.value.panTo(offsetCenter)
          }
        }
      }
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
  width: calc(100% - 320px);
  position: absolute;
  right: 0;

  @include for-tablet-landscape-down {
    width: 100%;
  }
}

#map {
  height: 100%;
}
</style>
