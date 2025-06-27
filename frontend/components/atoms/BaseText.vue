<template>
  <p v-if="safeText" v-html="safeText" />
  <p v-else ><slot/></p>
</template>

<script setup lang="ts">
defineProps<{
  safeText?: string
}>()
</script>

<style scoped lang="scss">
p {
  color: $white;
  line-height: 130%;
}

.text-primary {
  color: $primary-red;
}

.text-grey {
  color: $text-grey;
}

.text-black {
  color: $text-black;
}
.nowrap {
  white-space: nowrap;
}

.align-justify {
  text-align: justify;
}
</style>
