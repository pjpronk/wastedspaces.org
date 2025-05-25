import type { AddLocationResponse } from "~/plugins/api.client"
import type { LocationDetails } from "~/types/types"

export const useLocationApi = () => {
  const { $api } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const addLocation = async (
    locationData: Omit<
      LocationDetails,
      "id" | "verified" | "createdAt" | "updatedAt"
    >
  ): Promise<AddLocationResponse | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $api.location.addLocation(locationData)
      return response
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred"
      console.error("Error adding location:", err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    addLocation,
    isLoading: readonly(isLoading),
    error: readonly(error),
    clearError
  }
}
