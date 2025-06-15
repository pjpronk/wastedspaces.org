import type { AddLocationResponse } from "~/plugins/api.client"
import type { LocationDetails, VoteType } from "~/types/types"

declare module "#app" {
  interface NuxtApp {
    $relativeTime: (date: Date | string | number) => string
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
