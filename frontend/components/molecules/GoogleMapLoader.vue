<template>
  <div>
    <template v-if="googleConfig">
      <slot :google="googleConfig" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader"

const config = useRuntimeConfig()
const googleConfig: Ref<null | typeof google> = ref(null)

onMounted(async () => {
  googleConfig.value = await new Loader({
    libraries: ["places"],
    //TODO hide api key in config
    apiKey: "AIzaSyAxv6HVEk7ZTC4K9QxdPc9UT59oR3fGYtY"
  }).load()
})
</script>
