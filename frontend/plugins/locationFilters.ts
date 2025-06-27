import type { GeoPoint } from "@firebase/firestore"
import type { LocationDetails, LocationFilterState } from "~/types/types"
import { LocationStatus } from "~/types/types"

// Internal type only used within the plugin
interface LocationWithDistance extends LocationDetails {
  distance: number
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export default defineNuxtPlugin(() => {
  function filterByRadius(
    locations: LocationDetails[],
    center: GeoPoint,
    radius: number
  ): LocationDetails[] {
    return locations
      .map(
        (loc): LocationWithDistance => ({
          ...loc,
          distance: calculateDistance(
            center.latitude,
            center.longitude,
            loc.latLng.latitude,
            loc.latLng.longitude
          )
        })
      )
      .filter((loc) => loc.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...loc }) => loc) // Remove the distance property before returning
  }

  function filterByVerificationStatus(
    locations: LocationDetails[],
    selectedStatuses: LocationFilterState["status"]
  ): LocationDetails[] {
    // If no statuses are selected, return all locations
    const selectedStatusTypes = Object.entries(selectedStatuses)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => status.toLowerCase())

    if (selectedStatusTypes.length === 0) return locations

    return locations.filter((location) => {
      const { upvotes = 0, downvotes = 0 } = location
      let status: LocationStatus

      if (downvotes >= 5 && upvotes >= 5) {
        status = LocationStatus.GEMELD
      } else if (upvotes >= 5) {
        status = LocationStatus.BEVESTIGD
      } else if (downvotes >= 5) {
        status = LocationStatus.BETWIJFELD
      } else {
        status = LocationStatus.GEMELD
      }
      return selectedStatusTypes.includes(status.toLowerCase())
    })
  }

  function filterByType(
    locations: LocationDetails[],
    types: LocationFilterState["type"]
  ): LocationDetails[] {
    // If no types are selected (empty object or all false), return all locations
    const selectedTypes = Object.entries(types)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type.toLowerCase())

    if (selectedTypes.length === 0) return locations

    // Filter locations that match any of the selected types
    const filtered = locations.filter((location) =>
      selectedTypes.includes(location.type.toLowerCase())
    )
    return filtered
  }

  function filterByOwnership(
    locations: LocationDetails[],
    selectedOwnership: LocationFilterState["ownership"]
  ): LocationDetails[] {
    // If no ownership types are selected, return all locations
    const selectedOwnershipTypes = Object.entries(selectedOwnership)
      .filter(([_, isSelected]) => isSelected)
      .map(([ownership]) => ownership.toLowerCase())

    if (selectedOwnershipTypes.length === 0) return locations

    // Filter locations that match any of the selected ownership types
    return locations.filter((location) =>
      selectedOwnershipTypes.includes(location.ownership.toLowerCase())
    )
  }
  function filterByDuration(
    locations: LocationDetails[],
    selectedDurations: LocationFilterState["duration"]
  ): LocationDetails[] {
    // If no durations are selected, return all locations
    const selectedDurationTypes = Object.entries(selectedDurations)
      .filter(([_, isSelected]) => isSelected)
      .map(([duration]) => duration.toLowerCase())

    if (selectedDurationTypes.length === 0) return locations

    return locations.filter((location) => {
      const vacatedDate = location.vacatedSince
      const now = new Date()

      // Calculate months between dates
      const monthsDiff =
        (now.getFullYear() - vacatedDate.getFullYear()) * 12 +
        (now.getMonth() - vacatedDate.getMonth())

      let duration: string
      if (monthsDiff < 6) {
        duration = "kortdurig"
      } else if (monthsDiff < 24) {
        duration = "middellang"
      } else {
        duration = "langdurig"
      }

      return selectedDurationTypes.includes(duration)
    })
  }

  return {
    provide: {
      locationFilters: {
        filterByRadius,
        filterByVerificationStatus,
        filterByType,
        filterByOwnership,
        filterByDuration
      }
    }
  }
})
