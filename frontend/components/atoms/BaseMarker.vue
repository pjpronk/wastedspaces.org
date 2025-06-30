<template>
  <div v-if="map" ref="markerContent" class="marker-container">
    <BaseIcon :icon="statusIcon" class="icon icon-m white" />
    <LocationInfoWindow
      v-if="isActive"
      :key="`${location.id}-${Date.now()}`"
      class="info-window"
      :location="location"
      @close="handleCloseInfoWindow"
    />
    <svg class="triangle-pointer" width="30" height="15" viewBox="0 0 30 15">
      <path d="M 0,0 L 0,12 L 12,0 Z" fill="currentColor" />
      <path
        d="M 0,0 L 0,12 L 12,0"
        fill="currentColor"
        stroke="#ffffff"
        stroke-width="1"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"
import { useRoute } from "vue-router"

const props = defineProps<{
  map: google.maps.Map
  position: google.maps.LatLngLiteral
  location: LocationDetails
  autoClose?: boolean
}>()

const markerContent = ref<HTMLElement>()
const isActive = ref(false)
const route = useRoute()

let marker: google.maps.marker.AdvancedMarkerElement

const handleOpenInfoWindow = () => {
  if (marker?.content && marker.content instanceof HTMLElement) {
    marker.content.classList.add("active")
    marker.style.zIndex = "9999"
    isActive.value = true
    marker.content.style.left = "calc(50% - 12px)"
    marker.style.pointerEvents = "none"
  }
}

watch(
  () => route.query.selected,
  (newSelectedId) => {
    if (newSelectedId === props.location.id) {
      handleOpenInfoWindow()
    } else {
      handleCloseInfoWindow()
    }
  }
)

const statusIcon = computed(() => {
  const { upvotes = 0, downvotes = 0 } = props.location

  if (downvotes >= 5 && upvotes >= 5) {
    return "status-ongeverifieerd"
  } else if (upvotes >= 5) {
    return "status-geverifieerd"
  } else if (downvotes >= 5) {
    return "status-afgekeurd"
  } else {
    return "status-ongeverifieerd"
  }
})

const handleCloseInfoWindow = () => {
  if (marker.content && marker.content instanceof HTMLElement) {
    marker.content.classList.remove("active")
    isActive.value = false
    marker.style.zIndex = "initial"
    marker.style.pointerEvents = "auto"
  }
}

onMounted(() => {
  marker = new google.maps.marker.AdvancedMarkerElement({
    map: toRaw(props.map),
    position: { lat: props.position.lat, lng: props.position.lng },
    content: toRaw(markerContent.value)
  })
  marker.addListener("gmp-click", () => {
    if (marker.content && marker.content instanceof HTMLElement) {
      if (!marker.content.classList.contains("active")) {
        marker.content.classList.add("active")
        marker.style.zIndex = "9999"
        isActive.value = true
        marker.content.style.left = "calc(50% - 12px)"
        marker.style.pointerEvents = "none"
      }
    }
  })
})

onUnmounted(() => {
  if (marker) {
    marker.map = null // Remove marker from map
  }
})
</script>

<style lang="scss" scoped>
.marker-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $primary-red;
  position: relative;
  transition: width height min-width 0.3s ease-out;
  outline: 1px solid white;
  top: -12px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

.icon {
  z-index: 2;
  fill: $white;
  stroke: $white;
}

.triangle-pointer {
  position: absolute;
  bottom: -15px;
  left: -0.5px;
  z-index: 1;
  color: $primary-red;
}
.info-window {
  display: none;
  flex-direction: column;
  flex: 1;
}

.active {
  background-color: #ffffff;
  box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.4);
  height: auto;
  width: auto;
  filter: unset;
  padding: 0px;
  left: calc(50% - 12px);

  .triangle-pointer {
    color: $white;
    left: -1px;
  }

  .icon {
    display: none;
  }

  .info-window {
    display: flex;
  }

  .marker {
    display: none;
  }
}
</style>
