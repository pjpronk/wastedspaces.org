<template>
  <div class="location-create">
    <div class="location-create-header">
      <BaseTitle2 class="text-xl">MELD LEEGSTAND</BaseTitle2>
      <BaseButton @click.native="closeLocationCreate" icon="close" class="icon-sm primary-inverted"/>
    </div>
    <div class="location-create-form">
    <LocationInput v-model="address" id="location-create-input" label="Address" />
    <BaseDatePicker v-model="date" label="Datum van leegstand" :max="Date.now()" />
    <div class = "row">
      <BaseSelect v-model="type" label="Type" :options="typeOptions" />
      <BaseSelect v-model="ownership" label="Ownership" :options="ownershipOptions"/>
    </div>
    <BaseButton @click.native="submitLocation" class="submit primary-inverted mt-1-5" > Melden  </BaseButton>
  </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails, LocationType } from '~/types/types';
import BaseDatePicker from '../atoms/BaseDatePicker.vue';
import { v4 as uuidv4 } from 'uuid';
import { GeoPoint, Timestamp } from 'firebase/firestore';
import { ref } from 'vue';

const emit = defineEmits(['closeLocationCreate']);
const { $firestore } = useNuxtApp() as unknown as { $firestore: { addLocation: (location: LocationDetails) => Promise<void> } }


const address = ref('');
const date = ref('');
const type = ref('');
const ownership = ref('');

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

const closeLocationCreate = () => {
  emit('closeLocationCreate');
}

const submitLocation = () => {
  console.log({
    address: address.value,
    date: date.value,
    type: type.value,
    ownership: ownership.value
  });

  $firestore.addLocation({
    id: uuidv4(),
    type: type.value as LocationType,
    vacatedSince: new Date(date.value),
    city: 'Den Haag',
    latLng: new GeoPoint(52.0777, 4.3167),
    address: address.value,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date())
  });

  emit("closeLocationCreate")
}

</script>

<style scoped lang="scss">
.location-create {
  display: flex;
  flex-direction: column;
  background-color: $white;
}

.location-create-header {
  background-color: $primary-red;
  color: $white;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-create-form {
  padding: 0rem 1rem 1rem 1rem;
}

.submit {
  width: 100%;
}

.row {
  display: flex;
  gap: 1rem;
}

.report-button {
  margin-left: auto;
}
</style>
