declare module '#app' {
  interface NuxtApp {
    $relativeTime: (date: Date | string | number) => string
  }
} 