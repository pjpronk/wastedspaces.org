<template>
  <img class="base-image" :src="image"/>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ 
  image: string,
}>()
</script>
