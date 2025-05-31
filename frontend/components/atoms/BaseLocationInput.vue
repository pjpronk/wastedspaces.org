<template>
  <div class="base-location-input" :class="{ error: hasError }">
    <BaseIcon class="icon-sxs secondary" icon="search" />
    <input
      :id="id"
      class="input"
      :value="modelValue"
      type="text"
      placeholder="Zoek op locatie"
      @input="
        (e: Event) =>
          $emit('update:modelValue', (e.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { GeoPoint } from "firebase/firestore"

const props = defineProps({
  modelValue: {
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
  },
  restrictToSpecificAddresses: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: { address: string; city: string; latLng: GeoPoint } | string
  ): void
  (
    e:
      | "update:address"
      | "update:city"
      | "locationSelected"
      | "validationError",
    value: string
  ): void
  (e: "update:latLng", value: GeoPoint): void
}>()

const autocomplete = ref<google.maps.places.Autocomplete | null>(null)
const autocompleteOptions = computed(() => ({
  types: props.restrictToSpecificAddresses ? ["address"] : ["geocode"],
  fields: ["formatted_address", "geometry", "name", "address_components"]
}))

onMounted(() => {
  initializeAutocomplete()
})

function initializeAutocomplete() {
  const input = document.getElementById(props.id) as HTMLInputElement
  autocomplete.value = new props.google.maps.places.Autocomplete(
    input,
    autocompleteOptions.value
  )
  autocomplete.value?.addListener("place_changed", () => {
    const place = autocomplete.value?.getPlace()
    if (place) {
      if (props.restrictToSpecificAddresses) {
        const hasStreetNumber = place.address_components?.some(
          (
            component: google.maps.places.PlaceResult["address_components"][number]
          ) => component.types.includes("street_number")
        )

        if (!hasStreetNumber) {
          emit("update:modelValue", "")
          emit(
            "validationError",
            "Selecteer een specifiek adres met huisnummer"
          )
          return
        }
      }

      const lat = place.geometry?.location.lat()
      const lng = place.geometry?.location.lng()
      if (lat && lng) {
        const latLng = new GeoPoint(lat, lng)

        // Extract address components
        let streetName = ""
        let streetNumber = ""
        let city = ""

        place.address_components?.forEach(
          (
            component: google.maps.places.PlaceResult["address_components"][number]
          ) => {
            if (component.types.includes("route")) {
              streetName = component.long_name
            }
            if (component.types.includes("street_number")) {
              streetNumber = component.long_name
            }
            if (
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_2")
            ) {
              city = component.long_name
            }
          }
        )

        const address = streetNumber
          ? `${streetName} ${streetNumber}`
          : streetName

        const locationData = {
          address,
          city,
          latLng
        }

        emit("locationSelected", latLng)
        emit("update:address", locationData.address)
        emit("update:city", locationData.city)
        emit("update:latLng", locationData.latLng)
        emit("validationError", "")
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
  padding: 8px 12px;
  gap: 8px;
  align-items: center;
  border: 1px solid $grey;
}
.input {
  font-size: 14px;
  line-height: 100%;
  border: none;
  width: 100%;
  background-color: transparent;
}
</style>
