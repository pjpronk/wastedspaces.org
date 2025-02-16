<template>
  <input
    v-model="searchValue"
    @input="updateSearch"
    class="base-search-input"
    type="text"
    placeholder="Search..."
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const searchValue = ref(route.query.s || '');

const updateSearch = () => {
  router.push({ query: { ...route.query, s: searchValue.value || undefined } });
};

watch(() => route.query.s, (newS) => {
  searchValue.value = newS || '';
});
</script>

<style scoped>
.base-search-input {
  width: 100%;
  font-size: 16px;
  outline: none;
  border: none;
  padding: 10px;
}
</style>
