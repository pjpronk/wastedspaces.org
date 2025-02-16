<template>
  <div class="index">
    <div class="map-overlay">
      <BaseIcon class = "logo" icon="logo_white" />
      <BaseSearchInput />
      <LocationList :locations="locations" class="mt-1-0" />
    </div>
    <LocationMap class = "map" :locations="locations"/>
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from '~/types/types';

const { $apiFetch } = useNuxtApp();
useHead({
  title: "Kraakkaart",
  meta: [{ name: "", content: "" }]
})
const locations = ref<LocationDetails[]>([]);
const route = useRoute();

const fetchLocations = async () => {
  try {
    locations.value = await $apiFetch('locations', {
      query: route.query.s ? route.query.s.toString() : ""
    });
  } catch (error) {
    console.error(error);
  }
};

fetchLocations();

watch(() => route.query.s, fetchLocations);
</script>

<style lang="scss">
.index {
  display: flex;
  flex-direction: row;
}

.map-overlay { 
  background-color: $primary-red;

  overflow: hidden;
  margin : 1rem;
  height: calc(100% - 2rem);
  width: 320px;
  padding: 1rem;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9;
}

.map {
  flex: 1;
  height: 100vh;
  width: 100%;
}

.logo {
  width: 100px;
}
</style>
