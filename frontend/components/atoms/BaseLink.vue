<template>
  <a v-if="external" :href="link"> <slot /> </a>
  <NuxtLink v-else :to="link"><slot /> </NuxtLink>
</template>

<script setup lang="ts">
export interface Props {
  link: string
  external?: boolean
}

withDefaults(defineProps<Props>(), {
  external: false
})
</script>
