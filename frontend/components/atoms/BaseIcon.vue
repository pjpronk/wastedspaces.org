<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-if="icon" class="base-icon" v-html="icon" />
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
}>()

// Auto-load icons
const icons = Object.fromEntries(
  Object.entries(import.meta.glob("~/assets/icons/*.svg", { as: "raw" })).map(
    ([key, value]) => {
      const filename = key.split("/").pop()!.split(".").shift()
      return [filename, value]
    }
  )
)

// Lazily load the icon
const icon = props.icon && (await icons?.[props.icon]?.())
</script>

<style scoped lang="scss">
.base-icon {
  display: flex;
}

.primary {
  background-color: $primary-red;
  :deep(path) {
    stroke: $white;
    fill: $white;
  }
}

.secondary {
  background-color: $white;
  :deep(path) {
    stroke: $primary-red;
    fill: $primary-red;
  }
}

.icon-xs {
  width: 10px;
  height: 10px;
}

.icon-sxs {
  width: 15px;
  height: 15px;
}

.icon-s {
  width: 20px;
  height: 20px;
}
.icon-sm {
  width: 25px;
  height: 25px;
}
.icon-m {
  width: 30px;
  height: 30px;
}
.icon-l {
  width: 40px;
  height: 40px;
  padding: 10px;
}
.icon-lxl {
  width: 40px;
  height: 40px;
}
.icon-xl {
  width: 50px;
  height: 50px;
}
</style>
