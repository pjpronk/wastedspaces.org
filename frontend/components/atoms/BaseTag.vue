<template>
  <div class="base-tag text-s">{{ tag }}</div>
</template>

<script setup lang="ts">
defineProps<{
  tag: string
}>()
</script>

<style scoped lang="scss">
.base-tag {
  background-color: $grey;
  color: $primary-red;
  padding: 4px 8px;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  line-height: 100%;
}
</style>
