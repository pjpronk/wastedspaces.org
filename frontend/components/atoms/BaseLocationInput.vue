<template>
  <input
    id="geocode"
    :value="value"
    type="text"
    placeholder="Location"
    class="base-location-input"
  />
</template>

<script setup lang="ts">
import { GeoPoint } from 'firebase/firestore'

const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  google: {
    type: Object,
    required: true
  }
})

const autocomplete = ref<any>(null)
const autocompleteOptions = {
  types: ["geocode"],
  fields: ["formatted_address", "geometry", "name", "address_components"]
}

onMounted(() => {
  initializeAutocomplete()
})

const emit = defineEmits<{
  (e: 'locationSelected', location: GeoPoint): void
}>();


function initializeAutocomplete() {
  const input = document.getElementById("geocode") as HTMLInputElement
  autocomplete.value = new props.google.maps.places.Autocomplete(
    input,
    autocompleteOptions
  )
  autocomplete.value?.addListener("place_changed", () => {
    const place = autocomplete.value?.getPlace()
    if (place) {
      const lat = place.geometry?.location.lat()
      const lng = place.geometry?.location.lng()
      if (lat && lng) {
        const latLng = new GeoPoint(lat, lng)
        emit("locationSelected", latLng)
      }
    }
  })
}
</script>

<style scoped lang="scss">
.base-location-input {
  border: none;
  width: 100%;
  font-size: 14px;
  line-height: 100%;
  padding: 0.75rem 1rem;
}
</style>
