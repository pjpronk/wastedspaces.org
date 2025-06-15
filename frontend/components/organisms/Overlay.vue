<template>
  <div class="overlay-wrapper">
    <div class="overlay">
      <div class="overlay-header">
        <BaseTitle2 class="text-xl">{{ title }}</BaseTitle2>
        <BaseButton icon="close" class="icon-sm transparent" @click="close" />
      </div>
      <div class="overlay-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits(["close"])

const close = () => {
  emit("close")
}
</script>

<style scoped lang="scss">
.overlay-wrapper {
  width: 100%;
  height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: rgba($black, 0.6);

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: auto;
}

.overlay {
  background-color: $primary-red;
  min-width: 600px;
  display: flex;
  flex-direction: column;

  @include for-tablet-landscape-down {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: unset;
    background-color: $white;
  }
}

.overlay-header {
  background-color: $primary-red;
  color: $white;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
