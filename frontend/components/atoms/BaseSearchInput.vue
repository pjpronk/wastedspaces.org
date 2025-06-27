<template>
  <div class="base-search-input-wrapper">
    <BaseLabel v-if="label" :label="label" :for="id" />
    <input
      :id="id"
      v-model="searchValue"
      class="base-search-input"
      type="text"
      placeholder="Search..."
      @input="updateSearch"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import BaseLabel from "./BaseLabel.vue"

const route = useRoute()
const router = useRouter()
const searchValue = ref(route.query.s || "")

defineProps({
  label: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: "search-input"
  }
})

const updateSearch = () => {
  router.push({ query: { ...route.query, s: searchValue.value || undefined } })
}

watch(
  () => route.query.s,
  (newS) => {
    searchValue.value = newS || ""
  }
)
</script>

<style scoped>
.base-search-input {
  width: 100%;
  font-size: 1rem;
  outline: none;
  border: none;
  padding: 10px;
}

.border-grey {
  input {
    border: 1px solid $grey;
  }
}
</style>
