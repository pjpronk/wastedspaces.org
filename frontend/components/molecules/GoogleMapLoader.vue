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
    apiKey: "AIzaSyDgKblZaexJ5McxxTFOxB3lp_8hEQ2jZ-A"
  }).load()
})
</script>
