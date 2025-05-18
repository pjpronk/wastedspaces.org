<template>
  <div class="location-input" >
    <BaseLabel v-if="label" :label="label" :for="id" />
    <GoogleMapLoader>
      <template #default="{ google }">
        <BaseLocationInput 
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          @locationSelected="handleLocationSelected" 
          :google="google" 
          :id="id" 
        />
      </template>
    </GoogleMapLoader>
  </div>
</template>

<script setup lang="ts">
import { GeoPoint } from 'firebase/firestore'

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: "location-input"
  },
  label: {
    type: String,
    default: ""
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'locationSelected', latLng: GeoPoint): void
}>()

const handleLocationSelected = (latLng: GeoPoint) => {
  emit("locationSelected", latLng)
}
</script>

