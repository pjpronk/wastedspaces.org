<template>
  <div class="layout">
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  title: 'Wasted Spaces',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
    { name: 'description', content: 'Wasted Spaces is een online leegstandskaart waarop leegstand in jouw omgeving in kaart wordt gebracht via een open-source platform.' },
    { name: 'format-detection', content: 'telephone=no' },
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/images/activation-social-share.png' },
    { property: 'og:url', content: 'https://wastedspaces.org' },
    { property: 'og:title', content: 'Wasted Spaces' },
    { property: 'og:description', content: 'Wasted Spaces is een online leegstandskaart waarop leegstand in jouw omgeving in kaart wordt gebracht via een open-source platform.' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: '/images/activation-social-share.png' },
    { name: 'twitter:url', content: 'https://wastedspaces.org' },
    { name: 'twitter:title', content: 'Wasted Spaces' },
    { name: 'twitter:description', content: 'Wasted Spaces is een online leegstandskaart waarop leegstand in jouw omgeving in kaart wordt gebracht via een open-source platform.' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://wastedspaces.org' }
  ]
})
</script>

<style lang="scss">
html {
  font-size: 14px;
  line-height: 24px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;

  @include for-tablet-landscape-down {
    font-size: 16px;
  }
}

.layout {
  height: 100%;
}

body {
  background: $white;
}
</style>
