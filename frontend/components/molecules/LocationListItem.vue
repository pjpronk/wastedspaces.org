<template>
  <div class="location-list-item" @click="handleClick">
    <LocationHeader :location="location" />
    <div class="location-tags flex-row">
      <div class="flex-row gap-8">
        <BaseTag :tag="location.type.toString()" />
        <BaseTag :tag="location.ownership.toString()" />
      </div>
      <VoteCount :upvotes="location.upvotes" :downvotes="location.downvotes" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore"
import type { LocationDetails } from "~/types/types"

const props = defineProps<{
  location: LocationDetails
}>()

const emit = defineEmits<{
  (e: "locationSelected", latLng: GeoPoint): void
}>()

const handleClick = () => {
  emit("locationSelected", props.location.latLng)
}
</script>

<style scoped lang="scss">
.location-list-item {
  background-color: $white;
  color: $black;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 265px;
}

.location-tags {
  padding: 8px 16px;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.gap-8 {
  gap: 8px;
}
</style>
