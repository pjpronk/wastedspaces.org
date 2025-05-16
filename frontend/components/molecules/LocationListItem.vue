<template>
  <div class="location-list-item" @click="handleClick">
    <div class="location-header">
      <BaseIcon
        class="icon-l secondary"
        :icon="typeToIcon(location.type.toString())"
      />
      <div class="flex-column">
        <BaseText class="text-primary bold">{{ location.address }}</BaseText>
        <BaseText class="text-grey text-s">{{ location.city }}</BaseText>
      </div>
    </div>
    <div class="location-tags flex-row">
      <BaseText class="text-black text-s flex-row icon-text">
        <BaseIcon icon="calendar" class="secondary icon-xs" />
        {{ $relativeTime(location.createdAt.toDate()) }}
      </BaseText>
      <BaseTag>{{ location.type }}</BaseTag>
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
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 4px;
}

.location-header {
  border-bottom: 1px solid $grey;
  display: flex;
  width: 100%;
  padding: 4px;
}


.location-tags {
  padding: 8px 16px;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.icon-text {
  gap: 4px;
}
</style>
