<template>
  <ValidatedInput
    :id="id"
    ref="validatedInputRef"
    :label="label"
    :validation-rules="validationRules"
  >
    <template #default="{ hasError, onValidationError }">
      <GoogleMapLoader>
        <template #default="{ google }">
          <BaseLocationInput
            :id="id"
            :model-value="modelValue"
            :google="google"
            :restrict-to-specific-addresses="restrictToSpecificAddresses"
            :has-error="hasError"
            @update:model-value="$emit('update:modelValue', $event)"
            @update:address="$emit('update:address', $event)"
            @update:city="$emit('update:city', $event)"
            @update:lat-lng="$emit('update:latLng', $event)"
            @location-selected="handleLocationSelected"
            @validation-error="onValidationError"
          />
        </template>
      </GoogleMapLoader>
    </template>
  </ValidatedInput>
</template>

<script setup lang="ts">
import type { GeoPoint } from "firebase/firestore"
defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: "location-input"
  },
  label: {
    type: String,
    default: ""
  },
  restrictToSpecificAddresses: {
    type: Boolean,
    default: false
  },
  validationRules: {
    type: Array as PropType<Array<(value: string) => string | null>>,
    default: () => []
  }
})

const emit = defineEmits<{
  (e: "update:modelValue" | "update:address" | "update:city" | "validationError", value: string): void
  (e: "locationSelected" | "update:latLng", value: GeoPoint): void
}>()

const validatedInputRef = ref()

const handleLocationSelected = (latLng: GeoPoint) => {
  emit("locationSelected", latLng)
}

// Expose the validation interface from ValidatedInput
defineExpose({
  validate: (value: string) => validatedInputRef.value?.validate(value),
  hasError: computed(() => validatedInputRef.value?.hasError),
  errorMessage: computed(() => validatedInputRef.value?.errorMessage)
})
</script>

<style scoped lang="scss">
.error-message {
  color: $primary-red;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}
</style>
