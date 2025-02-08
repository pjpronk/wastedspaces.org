<template>
  <div class="index">
    <div class="side-bar">
      <LocationSearch />
      <LocationList class="mt-1-0" />
    </div>
    <LocationMap />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Kraakkaart",
  meta: [{ name: "", content: "" }]
})
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
