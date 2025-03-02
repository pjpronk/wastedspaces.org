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
        const address = place.formatted_address ? place.formatted_address.split(',')[0].trim() : null

        console.log(address)
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

<style scoped lang="scss">
.base-location-input {
  border: none;
  width: 100%;
  font-size: 14px;
  line-height: 100%;
  padding: 0.75rem 1rem;
}
</style>
