<template>
  <div class="location-info-window">
    <div class="image-container">
      <BaseImage
        :image="streetViewUrl"
        alt="Location Street View"
        class="location-image"
      />
      <div class="tags-container">
        <BaseTag :tag="location.type" />
        <BaseTag :tag="location.ownership" />
      </div>
    </div>
    <LocationHeader :location="location" />
    <div class="buttons mt-0-75">
      <BaseButton class="primary" @click="handleUpvote">
        <BaseVote :count="location.upvotes || 0" type="upvotes" />
      </BaseButton>
      <BaseButton class="primary" @click="handleDownvote">
        <BaseVote :count="location.downvotes || 0" type="downvotes" />
      </BaseButton>
      <BaseButton class="primary-inverted" @click.stop="$emit('close')">
        Sluiten
      </BaseButton>
    </div>
    <Teleport to="body">
      <Overlay
        v-if="openVoteDialog"
        title="Stem nu"
        @close="openVoteDialog = false"
      >
        <VoteCreate :location-id="location.id" :vote-type="voteType" />
      </Overlay>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"
import { VoteType } from "~/types/types"

const config = useRuntimeConfig()

const openVoteDialog = ref(false)
const voteType = ref(VoteType.UPVOTE)

const props = defineProps<{
  location: LocationDetails
}>()

defineEmits<{
  close: []
}>()

const streetViewUrl = computed(() => {
  const baseUrl = "https://maps.googleapis.com/maps/api/streetview"
  const size = "600x400"
  const apiKey = config.public.GOOGLE_MAPS_API_KEY
  const location = `${props.location.latLng.latitude},${props.location.latLng.longitude}`

  const params = new URLSearchParams({
    size,
    key: apiKey,
    location
  })

  return `${baseUrl}?${params.toString()}`
})

const handleUpvote = () => {
  voteType.value=VoteType.UPVOTE
  openVoteDialog.value = true
}

const handleDownvote = () => {
  voteType.value=VoteType.DOWNVOTE
  openVoteDialog.value = true
}
</script>

<style scoped lang="scss">
.image-container {
  position: relative;
  width: 100%;
  min-width: 200px;
  height: 120px;
}

.location-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}

.location-info-window {
  background-color: $white;
  color: $black;
  padding: 12px;
}

.tags-container {
  position: relative;
  padding: 8px;
  display: flex;
  gap: 8px;
}

.buttons {
  display: flex;
  gap: 8px;
}
</style>
