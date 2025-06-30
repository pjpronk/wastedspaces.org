<template>
  <div v-if="error" class="error-message">
    <span class="bold"> {{ title }} </span>
    <p>{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | null
  title?: string
}>()

defineEmits<{
  (e: "close"): void
}>()
</script>

<style scoped lang="scss">
.error-message {
  border: 2px solid $primary-red;
  font-size: 1rem;
  color: $black;
  padding: 1rem;
}

.error-content {
  flex: 1;
}

.close-button {
  padding: 4px !important;

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: $primary-red;
  }

  &:hover {
    :deep(svg) {
      fill: $white;
    }
  }
}

.bold {
  font-weight: bold;
}
</style>
