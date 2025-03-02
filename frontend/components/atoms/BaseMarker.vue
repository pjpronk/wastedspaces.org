<template>
    <div v-if="map">
        <div ref="infoWindowRef">
            <slot></slot>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    map: google.maps.Map;
    position: google.maps.LatLngLiteral;
    title?: string;
  }>();

  const infoWindowRef = ref<HTMLElement | null>(null);

  const marker = new google.maps.Marker({
      map: props.map,
      position: props.position,
      title: props.title || "",
    });

    const infoWindow = new google.maps.InfoWindow({disableAutoPan: true});

    marker.addListener("click", () => {
        infoWindow.close();
        if (infoWindowRef.value instanceof HTMLElement) {
            infoWindow.setContent(infoWindowRef.value);
        }
        infoWindow.open(props.map, marker);
    });

    onBeforeUnmount(() => {
        marker.setMap(null);
    });
  </script>
  