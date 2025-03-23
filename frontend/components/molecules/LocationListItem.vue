<template>
  <div class="location-list-item">
    <BaseIcon class = "icon" icon="industry" />
    <div class = "flex-column">
      <BaseText>{{ location.address }}</BaseText>
      <BaseText>+- 6 maanden</BaseText>
    </div>
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
  border: 2px solid $white;
  padding: 0px 12px;
  gap: 12px;

  display: flex;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
