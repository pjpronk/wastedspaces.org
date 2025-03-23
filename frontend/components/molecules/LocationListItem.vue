<template>
  <div class="location-list-item" @click="handleClick">
    <BaseIcon class="icon" icon="industry" />
    <div class="flex-column">
      <BaseText>{{ location.address }}</BaseText>
      <BaseText>+- 6 maanden</BaseText>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore";
import type { LocationDetails } from "~/types/types"

const props = defineProps<{
  location: LocationDetails
}>();

const emit = defineEmits<{
  (e: 'locationSelected', latLng: GeoPoint): void
}>();

const handleClick = () => {
  emit('locationSelected', props.location.latLng);
};
</script>

<style scoped lang="scss">
.location-list-item {
  border: 2px solid $white;
  padding: 0px 12px;
  gap: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba($white, 0.1);
  }
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
