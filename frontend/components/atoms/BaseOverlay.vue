<template>
  <div class="base-overlay">
    <div class="overlay-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this basic overlay
</script>

<style scoped lang="scss">
.base-overlay {
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

.overlay-content {
  background-color: $primary-red;
  min-width: 600px;
  @include for-tablet-landscape-down {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
