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

watch(() => props.center, (newCenter) => {
  console.log("newCenter", newCenter)
  if (map.value) {
    map.value.panTo(newCenter)
  }
}, { deep: true })
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
