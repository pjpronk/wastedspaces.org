<template>
  <button class="button">
    <BaseIcon v-if="icon" :icon="icon" class="button-icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
}>();
</script>

<style lang="scss" scoped>
.button {
  background-color: $white;
  color: $primary-red;
  padding: 12px 12px;
  width: fit-content;
  box-sizing: border-box;
  cursor: pointer;
  border: 0px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-inverted {
  background-color: $primary-red;
  color: $white;
}

.button-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
}
</style>
