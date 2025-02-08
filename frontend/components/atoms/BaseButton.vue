<template>
  <button class="button"><slot /></button>
</template>

<style lang="scss" scoped>
.button {
  background-color: $black;
  color: $white;
  padding: 10px 16px;
  border-radius: $border-radius;
  width: fit-content;
  box-sizing: border-box;
  border: 2px solid $black;
  cursor: pointer;
}
</style>
s
