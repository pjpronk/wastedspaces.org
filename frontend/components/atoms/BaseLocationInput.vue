<template>
  <div class="base-location-input">
    <BaseIcon class="icon-sxs secondary" icon="search" />
    <input
      class="input"
      :id="id"
      :value="value"
      type="text"
      placeholder="Zoek op locatie"
    />
  </div>
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
  },
  id: {
    type: String,
    default: "geocode"
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
  const input = document.getElementById(props.id) as HTMLInputElement
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
  display: flex;
  background-color: $white;
  padding: 12px;
  gap: 8px;
  align-items: center;
}

.input {
  font-size: 14px;
  line-height: 100%;
  border: none;
  width: 100%;
}
</style>
