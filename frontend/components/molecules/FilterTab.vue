<template>
    <div class="filter-tabs">
      <FilterTab
        v-for="option in filterOptions"
        :key="option.value"
        :class="['filter-tag', { active: modelValue === option.value }]"
        :tag ="option.label.toString()"
        @click="handleSelect(option.value)"
      /> 
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed } from "vue"
  import { LocationType } from "~/types/types"
  
  defineProps<{
    modelValue: string
  }>()
  
  const emit = defineEmits(["update:modelValue", "filterSelected"])
  
  const filterOptions = computed(() =>
    Object.keys(LocationType).map((key) => ({
      value: key,
      label: key
    }))
  )
  
  function handleSelect(value: string) {
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
    padding: 0.5rem 0.75rem;
    min-width: 80px;
  }
  .filter-tag.active {
    background: $primary-red;
    color: $white;
  }
  </style>
  