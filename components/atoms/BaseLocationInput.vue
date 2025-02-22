<!-- <template>
  <input
    id="geocode"
    :value="value"
    type="text"
    placeholder="Locatie"
    class="base-location-input"
  />
</template>

<script setup lang="ts">
import type { LocationDetails } from '~/types/types'

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

}
</script>

<style scoped>
.base-location-input {
  /* Add your styles here */
}
</style> -->
