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
  console.log(
    "GoogleMapLoader mounted",
    config.public.GOOGLE_MAPS_API_KEY,
    config
  )
  googleConfig.value = await new Loader({
    libraries: ["places", "marker"],
    apiKey: config.public.GOOGLE_MAPS_API_KEY
  })
    .load()
    .then()
})
</script>
