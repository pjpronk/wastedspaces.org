<template>
  <div class="filter-button-container">
    <div
      :class="[
        'filter-tab',
        {
          active: isActive,
          'has-selections': hasSelections
        }
      ]"
      @click.stop="toggleDropdown"
    >
      {{ label }}
      <div class="flex-row">
        <span class="filter-count">{{
          activeFilterCount ? `(${activeFilterCount})` : ""
        }}</span>
        <BaseIcon
          icon="chevron-down"
          class="icon-sxs"
          :class="{ 'rotate-180': isActive }"
        />
      </div>
    </div>
    <div v-if="isActive" class="filter-dropdown">
      <div class="filter-options">
        <label
          v-for="option in options"
          :key="option.value"
          class="filter-option"
        >
          <input
            v-model="selectedFilters[option.value]"
            type="checkbox"
            :name="option.value"
          />
          {{ option.label }}
        </label>
      </div>
      <div class="filter-actions">
        <BaseButton class="primary" @click="applyFilters">
          {{ saveLabel }}
        </BaseButton>
        <BaseButton class="transparent" @click="clearFilters">
          {{ clearLabel }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { FilterOption } from "~/types/types"

interface Props {
  options: FilterOption[]
  saveLabel?: string
  clearLabel?: string
  modelValue?: Record<string, boolean>
  label: string
  isActive: boolean
}

const props = withDefaults(defineProps<Props>(), {
  saveLabel: "Opslaan",
  clearLabel: "Wissen",
  modelValue: () => ({}),
  isActive: false
})

const emit = defineEmits(["update:modelValue", "toggle"])

// Initialize selectedFilters with all options set to false
const selectedFilters = ref<Record<string, boolean>>({})

// Initialize and update selectedFilters when props change
watch(
  () => props.options,
  (newOptions) => {
    const newFilters: Record<string, boolean> = {}
    newOptions.forEach((option) => {
      newFilters[option.value] = props.modelValue[option.value] || false
    })
    selectedFilters.value = newFilters
  },
  { immediate: true }
)

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    Object.keys(selectedFilters.value).forEach((key) => {
      selectedFilters.value[key] = newValue[key] || false
    })
  },
  { deep: true }
)

const hasSelections = computed(() => {
  return Object.values(selectedFilters.value).some((value) => value)
})

const activeFilterCount = computed(() => {
  return Object.values(selectedFilters.value).filter((value) => value).length
})

const toggleDropdown = () => {
  emit("toggle", props.isActive)
}

const applyFilters = () => {
  emit("update:modelValue", selectedFilters.value)
}

const clearFilters = () => {
  const clearedFilters = Object.keys(selectedFilters.value).reduce(
    (acc, key) => {
      acc[key] = false
      return acc
    },
    {} as Record<string, boolean>
  )

  selectedFilters.value = clearedFilters
  emit("update:modelValue", clearedFilters)
}
</script>

<style lang="scss" scoped>
.filter-button-container {
  position: relative;
}

.filter-tab {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  text-align: center;
  background: $white;
  justify-content: space-between;

  .icon-sxs {
    transition: transform 0.2s ease;
  }
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: $white;
  min-width: 200px;
  padding: 1rem;
  width: 100%;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

.filter-actions {
  display: flex;
  gap: 1rem;

  :deep(.button) {
    flex: 1;
  }
}

.filter-count {
  min-width: 20px;
  text-align: center;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
</style>
