export interface OverlayState {
  isOpen: boolean
  title: string
  component: string | null
}

export const useOverlay = () => {
  const overlayState = ref<OverlayState>({
    isOpen: false,
    title: '',
    component: null
  })

  const openOverlay = (title: string, component: string) => {
    overlayState.value = {
      isOpen: true,
      title,
      component
    }
  }

  const closeOverlay = () => {
    overlayState.value = {
      isOpen: false,
      title: '',
      component: null
    }
  }

  return {
    overlayState: readonly(overlayState),
    openOverlay,
    closeOverlay
  }
} 