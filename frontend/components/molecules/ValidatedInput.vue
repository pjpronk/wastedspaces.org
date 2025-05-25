<template>
  <div class="validated-input">
    <BaseLabel v-if="label" :label="label" :for="id" />
    <div class="input-wrapper" :class="{ 'error': !!errorMessage }">
      <slot 
        :has-error="!!errorMessage"
        :on-validation-error="handleValidationError"
        :clear-error="clearError"
      />
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: ""
  },
  validationRules: {
    type: Array as PropType<Array<(value: string) => string | null>>,
    default: () => []
  }
})

const errorMessage = ref('')

const handleValidationError = (message: string) => {
  errorMessage.value = message
}

const clearError = () => {
  errorMessage.value = ''
}

const validate = (value: string) => {
  for (const rule of props.validationRules) {
    const error = rule(value)
    if (error) {
      handleValidationError(error)
      return false
    }
  }
  clearError()
  return true
}

// Expose validation method for parent components
defineExpose({
  validate,
  hasError: computed(() => !!errorMessage.value),
  errorMessage: readonly(errorMessage)
})
</script>

<style scoped lang="scss">
.validated-input {
  width: 100%;
}

.input-wrapper.error {
  :deep(.base-location-input),
  :deep(.base-select),
  :deep(.base-date-picker),
  :deep(.base-input) {
    border-color: $primary-red !important;
    background-color: rgba($primary-red, 0.05) !important;
  }
}

.error-message {
  color: $primary-red;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}
</style> 