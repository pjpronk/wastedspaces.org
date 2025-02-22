<template>
  <img class="base-image" :src="image" />
</template>

<script setup lang="ts">
defineProps<{ image: string }>()
</script>
