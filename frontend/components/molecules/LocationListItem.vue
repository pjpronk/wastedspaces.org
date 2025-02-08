<template>
  <div class="location-list-item">
    <BaseText>{{ location.address }}</BaseText>
    <BaseText>{{ location.locality }}, {{ location.country }}</BaseText>
    <BaseText
      >Latitude: {{ location.latLng.latitude }}, Longitude:
      {{ location.latLng.longitude }}</BaseText
    >
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"

defineProps<{
  location: LocationDetails
}>()
</script>

<style scoped lang="scss">
.location-list-item {
  padding: 10px;
  background-color: $white;
  border-radius: $border-radius;
}
</style>
