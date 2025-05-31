export default defineNuxtPlugin(() => {
  return {
    provide: {
      relativeTime: (date: Date | string | number): string => {
        const dateObj =
          typeof date === "string" || typeof date === "number"
            ? new Date(date)
            : date

        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
          return "Invalid Date"
        }

        const now = new Date()
        const diffInMonths =
          (now.getFullYear() - dateObj.getFullYear()) * 12 +
          (now.getMonth() - dateObj.getMonth())

        if (diffInMonths === 0) {
          return "deze maand"
        }

        if (diffInMonths < 12) {
          return `${diffInMonths} maand${diffInMonths > 1 ? "en" : ""} geleden`
        }

        const years = Math.floor(diffInMonths / 12)
        return `${years} jaar geleden`
      }
    }
  }
})
