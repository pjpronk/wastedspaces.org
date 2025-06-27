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
        :disabled="isLoading"
        @click="submitVote"
      >
        {{ isLoading ? "Bezig met stemmen..." : buttonText }}
      </BaseButton>

      <div v-if="error" class="error-message mt-0-5">
        {{ error }}
        <button type="button" class="error-close" @click="clearError">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VoteType } from "~/types/types"
import { ref, computed } from "vue"
import { validationRules } from "~/utils/validation"
import { useVoteApi } from "~/composables/useVoteApi"

// Props
const props = defineProps<{
  locationId: string
  voteType: VoteType
}>()

const emit = defineEmits(["close"])
const { addVote, isLoading, error, clearError } = useVoteApi()

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

  if (!isEmailValid) {
    return // Don't submit if validation fails
  }

  const result = await addVote(props.locationId, props.voteType, email.value)
  if (result) {
    emit("close")
  } else if (error.value) {
    console.error("Error adding vote:", error.value)
    // Handle error appropriately - the error is now available in the error ref
  }
}
</script>

<style scoped lang="scss">
.vote-create {
  display: flex;
  flex-direction: column;
  background-color: $white;
}

.vote-create-form {
  padding: 0rem 1rem 1rem 1rem;
}

.submit {
  width: 100%;
}

.error-message {
  background-color: rgba($primary-red, 0.5);
  padding: 0.75rem;
  border-radius: 4px;
  color: $white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

.error-close {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
}

.error-close:hover {
  opacity: 0.7;
}
</style>
