<template>
  <div class="location-list-item">
    <BaseIcon icon="WS_location" />
    <BaseText>{{ location.address }}</BaseText>
    <BaseText
      >Latitude: {{ location.latitude }}, Longitude:
      {{ location.longitude }}</BaseText
    >
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"

defineProps<{
  location: LocationDetails
}>()

onMounted(() => {
  console.log("LocationListItem mounted")
  console.log(location)
})
</script>

<style scoped lang="scss">
.location-list-item {
  padding: 10px;
  background-color: $white;
  border-radius: $border-radius;
}
</style>
