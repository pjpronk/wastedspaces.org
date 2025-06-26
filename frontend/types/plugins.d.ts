import type { AddLocationResponse } from "~/plugins/api.client"
import type { LocationDetails, LocationFilterState, GeoPoint, VoteType } from "~/types/types"

declare module "#app" {
  interface NuxtApp {
    $relativeTime: (date: Date | string | number) => string
    $locationFilters: {
      filterByRadius: (
        locations: LocationDetails[],
        center: GeoPoint,
        radius: number
      ) => LocationDetails[]
      filterByVerificationStatus: (
        locations: LocationDetails[],
        selectedStatuses: LocationFilterState['status']
      ) => LocationDetails[]
      filterByType: (
        locations: LocationDetails[],
        types: LocationFilterState['type']
      ) => LocationDetails[]
      filterByOwnership: (
        locations: LocationDetails[],
        selectedOwnership: LocationFilterState['ownership']
      ) => LocationDetails[]
      filterByDuration: (
        locations: LocationDetails[],
        selectedDurations: LocationFilterState['duration']
      ) => LocationDetails[]
    }
    $api: {
      request<T>(endpoint: string, options?: RequestInit): Promise<T>
      location: {
        addLocation(
          location: LocationDetails,
          verificationEmail: string
        ): Promise<AddLocationResponse>
      }
      vote: {
        addVote(voteData: {
          locationId: string
          voteType: VoteType
          verificationEmail: string
        }): Promise<Response>
      }
    }
  }
}

