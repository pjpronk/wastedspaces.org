<template>
  <div v-if="icon" v-html="icon" class ="base-icon" />
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: string
  width?: number
  height?: number
}>()

// Auto-load icons
const icons = Object.fromEntries(
  Object.entries(import.meta.glob('~/assets/icons/*.svg', { as: 'raw' })).map(
    ([key, value]) => {
      const filename = key.split('/').pop()!.split('.').shift()
      return [filename, value]
    },
  ),
)

// Lazily load the icon
const icon = props.icon && (await icons?.[props.icon]?.())
</script>

<style scoped lang="scss">
.base-icon {
  display: flex;
}
</style>