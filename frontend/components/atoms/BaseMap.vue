<template>
  <div ref="mapContainer" class="map" />
  <template v-if="map">
    <slot :map="map" />
  </template>
</template>

<script setup lang="ts">
const props = defineProps<{
  google: any
  mapConfig: any
  center: { lat: number; lng: number }
}>()

const mapContainer = ref(null)
const map = ref(null)

onMounted(async () => {
  try {
    map.value = new props.google.maps.Map(mapContainer.value, props.mapConfig)
  } catch (error) {
    console.error("Error aloading map: ", error)
  }
})

watch(props.center, (newCenter) => {
  if (map.value) {
    map.value.panTo(newCenter)
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
