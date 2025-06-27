<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="vote-create">
    <div class="vote-create-form">
      <ValidatedInput
        id="email-input"
        ref="emailInput"
        label="E-mailadres (voor eenmalige verificatie)"
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

      <BaseButton
        class="submit primary-inverted mt-1-50"
        :disabled="isLoading || error"
        @click="submitVote"
      >
        {{ isLoading ? "Bezig met stemmen..." : buttonText }}
      </BaseButton>

      <BaseError
        :error="error"
        :title="result?.result || 'Er is iets mis gegaan...'"
        class="mt-1-0"
        @close="clearError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VoteType } from "~/types/types"
import { ref, computed } from "vue"
import { validationRules } from "~/utils/validation"
import { useVoteApi } from "~/composables/useVoteApi"
import BaseError from "../atoms/BaseError.vue"
import type { AddVoteResponse } from "~/plugins/api.client"

// Props
const props = defineProps<{
  locationId: string
  voteType: VoteType
}>()

defineEmits(["close"])
const { addVote, isLoading, error, clearError } = useVoteApi()
const result = ref<AddVoteResponse | null>(null)

// Form refs for validation
const emailInput = ref()

// Form data
const email = ref("")

// Validation rules
const emailValidationRules = [
  validationRules.required("E-mailadres"),
  validationRules.email("E-mailadres")
]

// Computed button text based on vote type
const buttonText = computed(() => {
  return props.voteType === VoteType.UPVOTE ? "Stem voor" : "Stem tegen"
})

// Validation methods
const validateEmail = () => {
  emailInput.value?.validate(email.value)
}

const submitVote = async () => {
  // Validate email field before submission
  const isEmailValid = emailInput.value?.validate(email.value)

  if (!(isLoading || error) || !isEmailValid) {
    return // Don't submit if validation fails
  }

  const apiResult = await addVote(props.locationId, props.voteType, email.value)
  if (apiResult) {
    result.value = apiResult
    error.value = apiResult.message
  } else if (error.value) {
    console.error("Error adding vote:", error.value)
  }
}
</script>

<style scoped lang="scss">
.vote-create {
  display: flex;
  flex-direction: column;
  background-color: $white;
}
.submit {
  width: 100%;
  font-size: 1rem;
}
</style>
