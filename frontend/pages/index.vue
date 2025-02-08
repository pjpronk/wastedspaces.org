<template>
  <div class="index">
    <div class="side-bar">
      <LocationSearch />
      <LocationList :locations="locations" class="mt-1-0" />
    </div>
    <LocationMap :locations="locations"/>
  </div>
</template>

<script setup lang="ts">
const { $apiFetch } = useNuxtApp();
useHead({
  title: "Kraakkaart",
  meta: [{ name: "", content: "" }]
})

const locations = ref<LocationDetails[]>([]);
const fetchLocations = async () => {
  try {
    locations.value = await $apiFetch('locations'); // Calls /locations
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchLocations);
</script>

<style lang="scss">
.index {
  display: flex;
  flex-direction: row;
}

.side-bar {
  background-color: $white;
  height: 100%;
  width: 320px;
  padding: 1rem;
  border-right: 2px solid $black;
}
</style>
