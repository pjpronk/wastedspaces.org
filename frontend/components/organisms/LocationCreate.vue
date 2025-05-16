<template>
  <div class="location-create">
    <LocationInput key="1" />
    <BaseDatePicker placeholder="Vacated since" :max="Date.now()" />
    <div class = "row">
      <BaseSelect placeholder="Type" :options="typeOptions" />
      <BaseSelect placeholder="Ownership" :options="ownershipOptions"/>
    </div>
    <BaseButton class="mt-1-0 report-button"> Report </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseDatePicker from '../atoms/BaseDatePicker.vue';

const ownershipOptions = ref([
  { value: 'PRIVATE', label: 'Private' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'UNKNOWN', label: 'Unknown' },
]);

const typeOptions = ref([
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'store', label: 'Store' },
  { value: 'office', label: 'Office' },
]);

</script>

<style scoped lang="scss">
.location-create {
  display: flex;
  flex-direction: column;
  padding: 1rem 0rem;
  gap: 0.5rem;
}

.row {
  display: flex;
  gap: 1rem;
}

.report-button {
  margin-left: auto;
}
</style>
