<template>
  <button class="button" :class="{ icon }">
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
  box-sizing: border-box;
  width: fit-content;
  cursor: pointer;
  border: 0px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 3rem;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  line-height: 100%;
  font-size: 14px;
}
.primary-inverted {
  background-color: $primary-red;
  color: $white;
}

.icon {
  padding: 12px 12px;
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
    fill: $white;
  }
}
</style>
