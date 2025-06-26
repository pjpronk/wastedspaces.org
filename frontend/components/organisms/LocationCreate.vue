<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="location-create">
    <div class="location-create-form">
      <LocationInput
        id="location-create-input"
        ref="addressInput"
        v-model="address"
        v-model:address="address"
        v-model:city="city"
        v-model:latLng="latLng"
        label="Address"
        :restrict-to-specific-addresses="true"
        :validation-rules="addressValidationRules"
        @update:model-value="validateAddress"
      />

      <ValidatedInput
        id="date-input"
        ref="dateInput"
        label="Datum van leegstand"
        :validation-rules="dateValidationRules"
      >
        <template #default="{ hasError, onValidationError }">
          <BaseDatePicker v-model="date" @update:model-value="validateDate" />
        </template>
      </ValidatedInput>

      <ValidatedInput
        id="email-input"
        ref="emailInput"
        label="E-mailadres (voor verificatie)"
        :validation-rules="emailValidationRules"
      >
        <template #default="{ hasError, onValidationError }">
          <BaseInput
            id="email-input"
            v-model="email"
            type="email"
            placeholder="email@voorbeeld.nl"
            @update:model-value="validateEmail"
          />
        </template>
      </ValidatedInput>

      <div class="row">
        <ValidatedInput
          id="type-input"
          ref="typeInput"
          label="Type"
          :validation-rules="typeValidationRules"
        >
          <template #default="{ hasError, onValidationError }">
            <BaseSelect
              v-model="type"
              :options="typeOptions"
              @update:model-value="validateType"
            />
          </template>
        </ValidatedInput>

        <ValidatedInput
          id="ownership-input"
          ref="ownershipInput"
          label="Ownership"
          :validation-rules="ownershipValidationRules"
        >
          <template #default="{ hasError, onValidationError }">
            <BaseSelect
              v-model="ownership"
              :options="ownershipOptions"
              @update:model-value="validateOwnership"
            />
          </template>
        </ValidatedInput>
      </div>

      <BaseButton
        class="submit primary-inverted mt-1-50"
        :disabled="isLoading"
        @click="submitLocation"
      >
        {{ isLoading ? "Bezig met melden..." : "Melden" }}
      </BaseButton>

      <div v-if="error" class="error-message mt-0-5">
        {{ error }}
        <button type="button" class="error-close" @click="clearError">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocationType, LocationOwnership } from "~/types/types"
import type { LocationDetails } from "~/types/types"
import BaseDatePicker from "../atoms/BaseDatePicker.vue"
import { GeoPoint, Timestamp } from "firebase/firestore"
import { ref } from "vue"
import { validationRules } from "~/utils/validation"
import { useLocationApi } from "~/composables/useLocationApi"

const emit = defineEmits(["close"])
const { addLocation, isLoading, error, clearError } = useLocationApi()

// Form refs for validation
const addressInput = ref()
const dateInput = ref()
const typeInput = ref()
const ownershipInput = ref()
const emailInput = ref()

// Form data
const address = ref("")
const city = ref("")
const latLng = ref(new GeoPoint(0, 0))
const date = ref("")
const type = ref("")
const ownership = ref("")
const email = ref("")

// Validation rules
const addressValidationRules = [validationRules.required("Adres")]

const dateValidationRules = [
  validationRules.dateRequired("Datum van leegstand"),
  validationRules.dateNotInFuture("Datum van leegstand")
]

const typeValidationRules = [validationRules.selectRequired("Type")]

const ownershipValidationRules = [validationRules.selectRequired("Ownership")]

const emailValidationRules = [
  validationRules.required("E-mailadres"),
  validationRules.email("E-mailadres")
]

// Options - dynamically generated from enums
const ownershipOptions = ref(
  Object.values(LocationOwnership).map((value) => ({
    value,
    label: value
  }))
)

const typeOptions = ref(
  Object.values(LocationType).map((value) => ({
    value,
    label: value
  }))
)

// Validation methods
const validateAddress = () => {
  addressInput.value?.validate(address.value)
}

const validateDate = () => {
  dateInput.value?.validate(date.value)
}

const validateType = () => {
  typeInput.value?.validate(type.value)
}

const validateOwnership = () => {
  ownershipInput.value?.validate(ownership.value)
}

const validateEmail = () => {
  emailInput.value?.validate(email.value)
}

const submitLocation = async () => {
  // Validate all fields before submission
  const isAddressValid = addressInput.value?.validate(address.value)
  const isDateValid = dateInput.value?.validate(date.value)
  const isTypeValid = typeInput.value?.validate(type.value)
  const isOwnershipValid = ownershipInput.value?.validate(ownership.value)
  const isEmailValid = emailInput.value?.validate(email.value)

  if (
    !isAddressValid ||
    !isDateValid ||
    !isTypeValid ||
    !isOwnershipValid ||
    !isEmailValid
  ) {
    return // Don't submit if validation fails
  }

  const location: LocationDetails = {
    id: "",
    address: address.value,
    city: city.value,
    type: type.value as LocationType,
    ownership: ownership.value as LocationOwnership,
    vacatedSince: new Timestamp(new Date(date.value).getTime(), 0),
    latLng: latLng.value,
    verified: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    upvotes: 0,
    downvotes: 0
  }

  const result = await addLocation(location, email.value)
  if (result) {
    emit("close")
  } else if (error.value) {
    console.error("Error adding location:", error.value)
    // Handle error appropriately - the error is now available in the error ref
  }
}
</script>

<style scoped lang="scss">
.location-create {
  display: flex;
  flex-direction: column;
  background-color: $white;
}

.location-create-form {
  padding: 0rem 1rem 1rem 1rem;
}

.submit {
  width: 100%;
}

.row {
  display: flex;
  gap: 1rem;
}

.report-button {
  margin-left: auto;
}

.error-message {
  background-color: rgba($primary-red, 0.5);
  padding: 0.75rem;
  border-radius: 4px;
  color: $white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.error-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
}

.error-close:hover {
  opacity: 0.7;
}
</style>
