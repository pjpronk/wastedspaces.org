<template>
  <div class="location-list">
    <LocationListItem
      v-for="location in locations"
      :key="location.latitude + ',' + location.longitude"
      :location="location"
    />
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"
const props = defineProps<{
  locations: LocationDetails[]
}>()

</script>

<style scoped lang="scss">
.location-list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  border: 2px solid $white;
}
</style>
