<template>
  <div class="location-create">
    <LocationInput />
    <BaseButton class="mt-1-0"> Gebouw Toevoegen </BaseButton>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.location-create {
  background-color: $white;
  border-radius: $border-radius;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
</style>
