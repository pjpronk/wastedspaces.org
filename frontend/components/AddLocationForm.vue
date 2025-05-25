<template>
  <div class="add-location-form">
    <h2>Add New Location</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="address">Address:</label>
        <input
          id="address"
          v-model="form.address"
          type="text"
          required
          placeholder="Enter address"
        />
      </div>
      
      <div class="form-group">
        <label for="city">City:</label>
        <input
          id="city"
          v-model="form.city"
          type="text"
          required
          placeholder="Enter city"
        />
      </div>
      
      <div class="form-group">
        <label for="type">Type:</label>
        <select id="type" v-model="form.type" required>
          <option value="">Select type</option>
          <option v-for="type in locationTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="ownership">Ownership:</label>
        <select id="ownership" v-model="form.ownership" required>
          <option value="">Select ownership</option>
          <option v-for="ownership in ownershipTypes" :key="ownership" :value="ownership">
            {{ ownership }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="vacatedSince">Vacated Since:</label>
        <input
          id="vacatedSince"
          v-model="form.vacatedSince"
          type="date"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="latitude">Latitude:</label>
        <input
          id="latitude"
          v-model.number="form.latitude"
          type="number"
          step="any"
          required
          placeholder="Enter latitude"
        />
      </div>
      
      <div class="form-group">
        <label for="longitude">Longitude:</label>
        <input
          id="longitude"
          v-model.number="form.longitude"
          type="number"
          step="any"
          required
          placeholder="Enter longitude"
        />
      </div>
      
      <div v-if="error" class="error">
        {{ error }}
        <button type="button" @click="clearError">×</button>
      </div>
      
      <div v-if="successMessage" class="success">
        {{ successMessage }}
      </div>
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Adding Location...' : 'Add Location' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { LocationType, LocationOwnership } from '~/types/types'

const { addLocation, isLoading, error, clearError } = useLocationApi()

const form = reactive({
  address: '',
  city: '',
  type: '' as LocationType | '',
  ownership: '' as LocationOwnership | '',
  vacatedSince: '',
  latitude: 0,
  longitude: 0
})

const successMessage = ref('')

const locationTypes = Object.values(LocationType)
const ownershipTypes = Object.values(LocationOwnership)

const handleSubmit = async () => {
  if (!form.type || !form.ownership) return
  
  successMessage.value = ''
  
  const result = await addLocation({
    address: form.address,
    city: form.city,
    type: form.type,
    ownership: form.ownership,
    vacatedSince: new Date(form.vacatedSince),
    latLng: {
      latitude: form.latitude,
      longitude: form.longitude
    }
  })
  
  if (result) {
    successMessage.value = `Location added successfully! ID: ${result.id}`
    // Reset form
    Object.assign(form, {
      address: '',
      city: '',
      type: '',
      ownership: '',
      vacatedSince: '',
      latitude: 0,
      longitude: 0
    })
  }
}
</script>

<style scoped>
.add-location-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error button {
  background: none;
  border: none;
  color: #721c24;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: auto;
}

.success {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style> 