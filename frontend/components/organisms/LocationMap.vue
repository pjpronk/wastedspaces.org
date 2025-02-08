<template>
  <div class="full-width">
    <GoogleMapLoader>
      <template v-slot="{ google }">
        <BaseMap :google="google" :mapConfig="mapConfig">
          <template v-slot="{ map }">
            <BaseMarker
              :google-config="google"
              :map="map"
              :marker="marker"
              v-for="marker in markers"
              :key="marker.id"
            />
          </template>
        </BaseMap>
      </template>
    </GoogleMapLoader>
  </div>
</template>

<script setup lang="ts">
const mapConfig = {
  center: { lat: 52.1326, lng: 5.2913 },
  zoom: 8,
  styles: [
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#444444" }]
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#f2f2f2" }]
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [
        { saturation: -100 },
        { lightness: 45 },
        { visibility: "simplified" },
        { weight: "3.80" }
      ]
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "simplified" }, { hue: "#ff0000" }]
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "road.arterial",
      elementType: "all",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road.local",
      elementType: "all",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ color: "#d9e2e9" }, { visibility: "on" }]
    }
  ]
}
</script>
