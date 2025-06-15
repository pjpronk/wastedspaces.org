<template>
  <div class="location-header">
    <BaseIcon
      class="icon-xl secondary"
      :icon="location.type.toString().toLowerCase()"
    />
    <div class="flex-column ml-0-50">
      <BaseText class="text-sm text-primary bold">{{
        location.address
      }}</BaseText>
      <BaseText class="text-grey text-s">{{ location.city }}</BaseText>
      <BaseText class="text-grey text-s">{{
        $relativeTime(location.createdAt.toDate())
      }}</BaseText>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"

const { $relativeTime } = useNuxtApp()

defineProps<{
  location: LocationDetails
}>()
</script>

<style scoped lang="scss">
.location-header {
  border-bottom: 1px solid $grey;
  display: flex;
  width: 100%;
  padding: 8px;
}
</style>
