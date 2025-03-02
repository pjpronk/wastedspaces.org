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
// Define props
const props = defineProps({
  value: {
    type: String,
    default: ""
  }
})

// Define emits
const emit = defineEmits(["update"])

// TODO add type
const update = (locationDetails: any) => {
  console.log(locationDetails)
  emit("update", locationDetails)
}
</script>

<style scoped lang="scss">
.location-input {
  width: 100%;
}
</style>
