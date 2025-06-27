<template>
  <div class="base-date-picker-wrapper" :class="$attrs.class">
    <BaseLabel v-if="label" :label="label" :for="id" />
    <div class="date-selects">
      <select
        :id="`${id}-month`"
        class="base-select month-select"
        :value="selectedMonth"
        :disabled="disabled"
        :required="required"
        @change="updateMonth($event.target.value)"
      >
        <option value="" disabled>Maand</option>
        <option
          v-for="(month, index) in months"
          :key="index"
          :value="String(index + 1).padStart(2, '0')"
        >
          {{ month }}
        </option>
      </select>

      <select
        :id="`${id}-year`"
        class="base-select year-select"
        :value="selectedYear"
        :disabled="disabled"
        :required="required"
        @change="updateYear($event.target.value)"
      >
        <option value="" disabled>Jaar</option>
        <option v-for="year in yearRange" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: ""
  },
  class: {
    type: String,
    default: ""
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  min: {
    type: String,
    default: "1900-01"
  },
  max: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(["update:modelValue"])

const months = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December"
]

const selectedMonth = computed(() => {
  if (!props.modelValue) return ""
  return props.modelValue.split("-")[1]
})

const selectedYear = computed(() => {
  if (!props.modelValue) return ""
  return props.modelValue.split("-")[0]
})

const minYear = computed(() => 1960)
const maxYear = computed(() =>
  props.max ? parseInt(props.max.split("-")[0]) : new Date().getFullYear()
)

const yearRange = computed(() => {
  const years = []
  for (let year = maxYear.value; year >= minYear.value; year--) {
    years.push(year)
  }
  return years
})

const updateMonth = (month) => {
  const year = selectedYear.value || new Date().getFullYear()
  emit("update:modelValue", `${year}-${month}`)
}

const updateYear = (year) => {
  const month = selectedMonth.value || "01"
  emit("update:modelValue", `${year}-${month}`)
}
</script>

<style scoped lang="scss">
.date-selects {
  display: flex;
  gap: 8px;
}

.base-select {
  font-family: Tahoma;
  font-size: 1rem;
  line-height: 100%;
  padding: 8px 12px;
  border: 1px solid $grey;
  background-color: white;

  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  font-size: 1rem;
  color: currentColor;
}

.month-select {
  flex: 3;
}

.year-select {
  flex: 2;
}
</style>
