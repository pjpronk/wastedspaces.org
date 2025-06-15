<template>
  <button class="button" :class="{ icon }">
    <BaseIcon v-if="icon" :icon="icon" class="button-icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>

<style lang="scss" scoped>
.button {
  box-sizing: border-box;
  width: fit-content;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 2rem;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  line-height: 100%;
  font-size: 12px;
  border: 0px;
}

.primary {
  background-color: $white;
  color: $primary-red;
  border: 1px solid $primary-red;

  &:hover {
    color: $white;
    background-color: $primary-red;
  }
}

.primary-inverted {
  background-color: $primary-red;
  color: $white;
  border: 1px solid $primary-red;

  &:hover {
    background-color: $primary-red-hover;
    border: 1px solid $primary-red-hover;
  }
}

.transparent {
  background-color: transparent;
  &:hover {
    opacity: 0.8;
  }
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
