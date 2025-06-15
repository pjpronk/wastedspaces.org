import type { LocationDetails, VoteType } from "~/types/types"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Base API client
  const apiClient = {
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${config.public.BACKEND_URL}${endpoint}`

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        )
      }

      return response.json()
    }
  }

  // Location API methods
  const locationApi = {
    async addLocation(
      locationData: LocationDetails,
      verificationEmail: string
    ): Promise<Response> {
      // Convert LocationDetails to the format expected by the API
      const requestData = {
        address: locationData.address,
        city: locationData.city,
        type: locationData.type,
        ownership: locationData.ownership,
        vacatedSince: locationData.vacatedSince.toISOString(),
        latLng: {
          latitude: locationData.latLng.latitude,
          longitude: locationData.latLng.longitude
        },
        verificationEmail: verificationEmail
      }

      return apiClient.request<Response>("addLocation", {
        method: "POST",
        body: JSON.stringify(requestData)
      })
    }
  }

  // Vote API methods
  const voteApi = {
    async addVote(voteData: {
      locationId: string;
      voteType: VoteType;
      verificationEmail: string;
    }): Promise<Response> {
      return apiClient.request<Response>("addVote", {
        method: "POST",
        body: JSON.stringify(voteData)
      })
    }
  }

  return {
    provide: {
      api: {
        ...apiClient,
        location: locationApi,
        vote: voteApi
      }
    }
  }
})