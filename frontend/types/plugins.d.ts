import type { AddLocationResponse } from "~/plugins/api.client"
import type { LocationDetails } from "~/types/types"

declare module "#app" {
  interface NuxtApp {
    $relativeTime: (date: Date | string | number) => string
    $api: {
      request<T>(endpoint: string, options?: RequestInit): Promise<T>
      location: {
        addLocation(location: LocationDetails): Promise<AddLocationResponse>
      }
    }
  }
}
