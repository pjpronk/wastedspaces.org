import type { VoteType } from "~/types/types"

export const useVoteApi = () => {
  const { $api } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const addVote = async (
    locationId: string,
    voteType: VoteType,
    verificationEmail: string
  ): Promise<Response | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $api.vote.addVote({
        locationId,
        voteType,
        verificationEmail
      })
      return response
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred"
      console.error("Error adding vote:", err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    addVote,
    isLoading: readonly(isLoading),
    error: readonly(error),
    clearError
  }
} 