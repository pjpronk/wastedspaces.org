<template>
  <div class="base-location-input-container">
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
  emit("update", locationDetails)
}
</script>

<style scoped lang="scss">
.base-location-input {
  border: none;
  font-size: 18px;
  line-height: 36px;
  cursor: text;
  width: 100%;
  padding: 3px;
}
.base-location-input-container {
  width: 100%;
  input::placeholder {
    font-size: 15px !important;
    font-weight: 400 !important;
  }
}
</style>
