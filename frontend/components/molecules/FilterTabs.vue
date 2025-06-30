<template>
  <div class="filter-tabs">
    <FilterTab
      v-for="tab in tabs"
      :key="tab.type"
      :model-value="props.modelValue[tab.type]"
      :label="tab.label"
      :is-active="activeTab === tab.type"
      :options="getOptionsForType(tab.type)"
      @update:model-value="(newValue) => handleUpdate(tab.type, newValue)"
      @toggle="(value) => toggleTab(tab.type, value)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import FilterTab from "./FilterTab.vue"
import type {
  LocationFilterType,
  LocationFilterState,
  FilterOption
} from "~/types/types"
import {
  LocationType,
  LocationOwnership,
  LocationStatus,
  LocationDuration
} from "~/types/types"
import { useRoute, useRouter } from "vue-router"

const props = defineProps<{
  modelValue: LocationFilterState
}>()

const emit = defineEmits(["update:modelValue"])

const route = useRoute()
const router = useRouter()

const activeTab = ref<LocationFilterType | null>(null)

const handleUpdate = (
  type: LocationFilterType,
  newValue: Record<string, boolean>
) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [type]: newValue
  })
  activeTab.value = null
}

// Watch for filter changes and update URL
watch(
  () => props.modelValue,
  (newFilters) => {
    // Serialize filters to query params
    const query: Record<string, unknown> = { ...route.query }
    for (const type of Object.keys(newFilters)) {
      const selected = Object.entries(newFilters[type as LocationFilterType])
        .filter(([_, v]) => v)
        .map(([k]) => k)
      if (selected.length > 0) {
        query[type] = selected.join(",")
      } else {
        Reflect.deleteProperty(query, type)
      }
    }

    // Remove any keys with null/undefined values and convert to lowercase
    const sanitizedQuery: Record<string, string> = {}
    for (const key in query) {
      if (typeof query[key] === "string" && query[key] !== undefined) {
        sanitizedQuery[key] = (query[key] as string).toLowerCase()
      }
    }

    // Update URL without triggering a page reload
    router.replace({ query: sanitizedQuery })
  },
  { deep: true }
)
const tabs = [
  { type: "type" as const, label: "Type" },
  { type: "ownership" as const, label: "Eigendom" },
  { type: "status" as const, label: "Status" },
  { type: "duration" as const, label: "Duur" }
]

const toggleTab = (type: LocationFilterType, value: boolean) => {
  activeTab.value = !value ? type : null
}

const getOptionsForType = (type: LocationFilterType): FilterOption[] => {
  switch (type) {
    case "type":
      return Object.entries(LocationType).map(([value, label]) => ({
        value,
        label
      }))
    case "ownership":
      return Object.entries(LocationOwnership).map(([value, label]) => ({
        value,
        label
      }))
    case "status":
      return Object.entries(LocationStatus).map(([value, label]) => ({
        value,
        label
      }))
    case "duration":
      return Object.entries(LocationDuration).map(([value, label]) => ({
        value,
        label
      }))
    default:
      return []
  }
}
</script>

<style scoped lang="scss">
.filter-tabs {
  display: flex;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  line-height: 1;
  color: $black;

  :hover {
    color: $white;
  }
}
</style>
