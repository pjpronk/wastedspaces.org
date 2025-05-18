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
  const config = useRuntimeConfig();
  const basePath = config.app.baseURL || '/';

  const markerIcon = document.createElement("img");
  markerIcon.src = `${basePath}icons/marker.svg`.replace('//', '/');
  markerIcon.style.width = "30px";
  markerIcon.style.height = "30px";

  const marker = new google.maps.Marker({
      map: props.map,
      position: {lat: props.position.lat, lng: props.position.lng},
      icon: markerIcon.src,
    });

    const infoWindow = new google.maps.InfoWindow({disableAutoPan: true});

    marker.addListener("click", () => {
        infoWindow.close();
        if (infoWindowRef.value instanceof HTMLElement) {
            infoWindow.setContent(infoWindowRef.value);
        }
        infoWindow.open(props.map, marker);
    });

  </script>
  