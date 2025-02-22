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
