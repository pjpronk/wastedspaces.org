<template>
  <div class="location-input">
    <GoogleMapLoader>
      <template #default="{ google }">
        <BaseLocationInput @update="update" :value="value" :google="google" />
      </template>
    </GoogleMapLoader>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(["update"])

const update = (locationDetails: any) => {
  emit("update", locationDetails)
}
</script>

<style scoped lang="scss">
.location-input {
  width: 100%;
}
</style>
