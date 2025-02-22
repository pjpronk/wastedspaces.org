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
}>()

const mapContainer: HTMLElement | null = null
let map: google.maps.Map | null = null

onMounted(async () => {
  try {
    if (!mapContainer) return
    map = new props.google.maps.Map(mapContainer, props.mapConfig)
  } catch (error) {
    console.error("Error aloading map: ", error)
  }
})
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
  width: 100%;
  position: absolute;
}

#map {
  height: 100%;
}
</style>
