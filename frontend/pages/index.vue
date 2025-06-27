<template>
  <div class="index">
    <div class="map-overlay">
      <div class="sidebar">
        <div class="flex-row">
          <BaseIcon class="logo" icon="logo"/>        
        </div>
        <div class="flex-row mt-1-50">
          <LocationInput
            id="sidebar-input"
            @location-selected="handleLocationInput"
          />
        </div>
        <FilterTabs v-model="currentFilters" class="mt-1-0" />
        <LocationList
          :locations="currentLocations"
          class="mt-1-50"
          @location-selected="handleLocationSelected"
        />
      </div>
      <div class="top-bar">
        <div class = "flex-row gap-8">
        <BaseIcon class="white icon-lxl" icon="logo_standalone_red" />
        <LocationInput
          id="topbar-input"
          @location-selected="handleLocationInput"
        />
        <BaseButton class="secondary icon-s" icon="filter" @click="toggleFilters"></BaseButton>
      </div>

        <Transition name="slide-fade">
          <FilterTabs v-model="currentFilters" class="mt-0-50 flex-column" v-if="isFilterVisible" />
        </Transition>
      </div>

      <div class="info-buttons">
        <div class="info-buttons-aside">
          <BaseButton class="primary-inverted" icon="info" @click="openInfoModal"/>
          <BaseButton class="primary-inverted" icon="documents" />
        </div>
        <BaseButton
          class="primary-inverted"
          icon="add"
          @click="openLocationCreate"
        />
      </div>
      <div class="bottom-bar">
        <LocationSlider
          :locations="currentLocations"
          @location-selected="handleLocationSelected"
        />
      </div>
    </div>
    <Overlay
      v-if="overlayState.isOpen"
      :title="overlayState.title"
      @close="closeOverlay"
    >
      <LocationCreate
        v-if="overlayState.component === 'LocationCreate'"
        @close="closeOverlay"
      />
      <BaseText
        v-if="overlayState.component === 'BaseText'"
        class="text-black align-justify"
        :safe-text="infoText"
        @close="closeOverlay"
      />
    </Overlay>
    <LocationMap
      class="map"
      :locations="currentLocations"
      :center="currentCenter"
      @location-selected="handleLocationSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { GeoPoint } from "@firebase/firestore"
import type {
  LocationDetails,
  LocationFilterState,
  LocationFilterType
} from "~/types/types"
import { useRoute } from "vue-router"
import { infoText } from "~/content/info-text"

const { $firestore, $locationFilters } = useNuxtApp() as unknown as {
  $firestore: { getLocations: () => Promise<LocationDetails[]> }
  $locationFilters: {
    filterByRadius: (
      locations: LocationDetails[],
      center: GeoPoint,
      radius: number
    ) => LocationDetails[]
    filterByType: (
      locations: LocationDetails[],
      selectedTypes: LocationFilterState["type"]
    ) => LocationDetails[]
    filterByVerificationStatus: (
      locations: LocationDetails[],
      selectedStatuses: LocationFilterState["status"]
    ) => LocationDetails[]
    filterByOwnership: (
      locations: LocationDetails[],
      selectedOwnership: LocationFilterState["ownership"]
    ) => LocationDetails[]
    filterByDuration: (
      locations: LocationDetails[],
      selectedDurations: LocationFilterState["duration"]
    ) => LocationDetails[]
  }
}

const allLocations = ref<LocationDetails[]>([])
const currentLocations = ref<LocationDetails[]>([])
const currentCenter = ref(new GeoPoint(51.9146308, 4.4709485)) // Default to Rotterdam
const route = useRoute()

const isFilterVisible = ref(false)
const toggleFilters = () => {
  isFilterVisible.value = !isFilterVisible.value
}

function parseFiltersFromQuery(
  query: Record<string, unknown>
): LocationFilterState {
  const filterTypes: LocationFilterType[] = [
    "type",
    "ownership",
    "status",
    "duration"
  ]
  const filters: LocationFilterState = {
    type: {},
    ownership: {},
    status: {},
    duration: {}
  }
  for (const type of filterTypes) {
    const value = query[type]
    if (typeof value === "string" && value.length > 0) {
      value.split(",").forEach((v: string) => {
        filters[type][v.toUpperCase()] = true
      })
    }
  }
  return filters
}

// Initialize filters from URL only once on page load
const currentFilters = ref<LocationFilterState>({
  type: {},
  ownership: {},
  status: {},
  duration: {}
})

// Watch for filter changes and update locations
watch(
  currentFilters,
  (newFilters) => {
    currentLocations.value = applyAllFilters(
      allLocations.value,
      currentCenter.value,
      searchRadius.value,
      newFilters
    )
  },
  { deep: true }
)

const searchRadius = ref(50) // Default radius in kilometers

// Use the overlay composable
const { overlayState, openOverlay, closeOverlay } = useOverlay()

const applyAllFilters = (
  locations: LocationDetails[],
  center: GeoPoint,
  radius: number,
  filters: LocationFilterState
): LocationDetails[] => {
  // First filter by radius
  let filtered = $locationFilters.filterByRadius(locations, center, radius)

  // Then filter by type
  filtered = $locationFilters.filterByType(filtered, filters.type)

  // Then filter by ownership
  filtered = $locationFilters.filterByOwnership(filtered, filters.ownership)

  // Then filter by duration
  filtered = $locationFilters.filterByDuration(filtered, filters.duration)

  // Finally filter by verification status
  filtered = $locationFilters.filterByVerificationStatus(
    filtered,
    filters.status
  )

  return filtered
}

const fetchLocations = async () => {
  try {
    allLocations.value = await $firestore.getLocations()
    currentLocations.value = applyAllFilters(
      allLocations.value,
      currentCenter.value,
      searchRadius.value,
      currentFilters.value
    )
  } catch (error) {
    console.error("Error fetching locations:", error)
  }
}

const handleLocationSelected = (latLng: GeoPoint) => {
  currentCenter.value = latLng
}

const handleLocationInput = (latLng: GeoPoint) => {
  currentCenter.value = latLng
  currentLocations.value = applyAllFilters(
    allLocations.value,
    currentCenter.value,
    searchRadius.value,
    currentFilters.value
  )
}

// Specific overlay opening functions
const openLocationCreate = () => {
  openOverlay("Meld leegstand", "LocationCreate")
}

// Specific overlay opening functions
const openInfoModal = () => {
  openOverlay("Informatie", "BaseText")
}

// Initial fetch
fetchLocations()

onMounted(() => {
  currentFilters.value = parseFiltersFromQuery(route.query)
})
</script>

<style lang="scss">
.index {
  display: flex;
  flex-direction: row;
}
.info-buttons {
  display: flex;
  flex-direction: column;
  pointer-events: none;
  height: 100%;
  justify-content: space-between;
  padding: 1rem;
  align-items: flex-end;

  button {
    pointer-events: auto;
  }
}

.info-buttons-aside {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.top-bar {
  background-color: $primary-red;
  pointer-events: auto;
  padding: 1rem;
  @include for-tablet-landscape-up {
    display: none;
  }
}

.bottom-bar {
  background-color: $primary-red;
  pointer-events: auto;

  @include for-tablet-landscape-up {
    display: none;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $primary-red;
  pointer-events: auto;
  padding: 1rem;

  @include for-tablet-landscape-down {
    display: none;
  }
}

.map-overlay {
  overflow: hidden;
  display: flex;
  height: 100%;
  width: 100%;
  z-index: 9;
  pointer-events: none;
  position: absolute;
  justify-content: space-between;

  @include for-tablet-landscape-down {
    flex-direction: column;
    padding: 0px;
  }
}

.map {
  flex: 1;
  height: 100vh;
  width: 100%;
}

.logo {
  width: 80%;
  margin-right: auto;
  fill: $white;
}

.gap-8 {
  gap: 8px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
