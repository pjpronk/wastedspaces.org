<template>
    <div class="location-info-window">
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

  </script>
  
  <style scoped lang="scss">
  .location-info-window {
    padding: 10px;
    background-color: $white;
  }
  </style>
  