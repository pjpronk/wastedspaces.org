<template>
  <label v-if="label" :for="for" class="base-label">
    {{ label }}
  </label>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  for: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.base-label {
  line-height: 120%;
  color: $primary-red;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  display: block;
}
</style> 