<template>
  <img class="base-image" :src="cachedImageUrl" @error="handleImageError" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ 
  image: string,
}>()
const cachedImageUrl = ref('')

const getCachedImage = async (cacheKey: string) => {
    try {
      const cache = await caches.open('streetview-images')
      const response = await cache.match(cacheKey)
      if (response) {
        return URL.createObjectURL(await response.blob())
      }
      return null
    } catch (error) {
      console.error('Error accessing cache:', error)
      return null
    }
  }


const cacheImage = async (cacheKey: string, imageUrl: string) => {
    try {
      const cache = await caches.open('streetview-images')
      const response = await fetch(imageUrl)
      await cache.put(cacheKey, response.clone())
    } catch (error) {
      console.error('Error caching image:', error)
    }
  }

const loadImage = async () => {
    const cacheKey = `streetview-images-${generateHash(props.image)}`
    
    // Try to get from cache first
    const cachedUrl = await getCachedImage(cacheKey)
    if (cachedUrl) {
      cachedImageUrl.value = cachedUrl
      return
    }

    // If not in cache, fetch and cache it
    cachedImageUrl.value = props.image
    await cacheImage(cacheKey, props.image)
}

const generateHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

const handleImageError = () => {
  // Fallback to a placeholder image
  cachedImageUrl.value = '/images/placeholder.jpg'
}

onMounted(() => {
  loadImage()
})
</script>
