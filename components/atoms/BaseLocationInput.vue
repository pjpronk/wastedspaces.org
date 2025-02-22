<template>
  <input
    id="geocode"
    :value="value"
    type="text"
    placeholder="Locatie"
    class="base-location-input"
  />
</template>

<script setup lang="ts">
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

const emit = defineEmits(["update"])

const mapConfig = { zoom: 13, disableDefaultUI: true, clickableIcons: false }
const autocomplete = ref<any>(null)
const autocompleteOptions = {
  types: ["geocode"]
}

onMounted(() => {
  initializeAutocomplete()
})

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
        const latLng = { latitude: lat, longitude: lng }
        const address = place.formatted_address ? place.formatted_address : null

        // TODO: ADD TYPE
        const locationDetails: any = {
          address: address,
          latLng: latLng,
          name: place.name,
          country:
            place.address_components && place.address_components[3].long_name,
          locality:
            place.address_components && place.address_components[1].long_name
        }
        emit("update", locationDetails)
      }
    }
  })
}
</script>

<style scoped>
.base-location-input {
  /* Add your styles here */
}
</style>
