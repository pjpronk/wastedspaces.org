<template>
  <div class="overlay-wrapper">
    <div class="overlay">
      <div class="overlay-header">
        <BaseTitle2 class="text-lg">{{ title }}</BaseTitle2>
        <BaseButton
          icon="close"
          class="button icon-xs transparent"
          @click="close"
        />
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

  background-color: rgba($full-black, 0.75);

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: auto;
}

.overlay {
  background-color: $white;
  min-width: 500px;
  max-width: 500px;
  display: flex;
  flex-direction: column;

  @include for-tablet-landscape-down {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    min-width: unset;
    max-width: unset;

    background-color: $white;
  }
}

.overlay-header {
  color: $primary-red;
  padding: 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overlay-content {
  padding: 0rem 1.5rem 1.5rem 1.5rem;
  overflow-y: scroll;
}

.button {
  color: $primary-red;
}
</style>
