<template>
  <div class="location-list-item" @click="handleClick">
    <BaseIcon class="icon primary" :icon="typeToIcon(location.type.toString())" />
    <div class="flex-column">
      <BaseText class="text-black text-sm">{{ location.address }}</BaseText>
      <BaseText class="text-black text-sm">{{ $relativeTime(location.createdAt.toDate()) }}</BaseText>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore"
import { typeToIcon } from "~/types/types"
import type { LocationDetails } from "~/types/types"

const { $relativeTime } = useNuxtApp()

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

  padding: 10px 12px;
  gap: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.icon {
  width: 25px;
  height: 25px;
}
</style>
