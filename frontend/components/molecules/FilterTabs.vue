<template>
  <div class="filter-tabs">
    <BaseTag
      v-for="option in typeOptions"
      :key="option.value"
      :class="['filter-tag', { active: modelValue === option.value }]"
      class="skewed"
      @click="handleSelect(option.value)"
    >
      {{ option.label }}
    </BaseTag>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue"
import BaseTag from "../atoms/BaseTag.vue"
import { LocationType } from "~/types/types"

defineProps<{
  modelValue: string
}>()

const emit = defineEmits(["update:modelValue", "filterSelected"])

const typeOptions = computed(() =>
  Object.entries(LocationType).map(([key, label]) => ({
    value: key,
    label
  }))
)

function handleSelect(value: string) {
  console.log("handleSelect", value)
  emit("update:modelValue", value)
  emit("filterSelected", value)
}
</script>

<style scoped lang="scss">
.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-tag {
  cursor: pointer;
  background: $white;
  padding: 0.5rem 0.5rem;
}
.filter-tag.active {
  background: $primary-red;
  color: $white;
}

.skewed {
  transform: skew(
    -2deg
  ); /* Adjust the angle (10deg) to control how much the element is slanted */
  /* Optional: if you want to keep the content straight while the container is skewed */
  & > * {
    transform: skew(2deg); /* Counter-skew the content to keep it straight */
  }
}
</style>
