<template>
  <p><slot /></p>
</template>

<style scoped lang="scss">

p {
  color: $white;
  line-height: 100%;
}

.bold {
  font-weight: bold;
}

.text-primary {
  color: $primary-red;
}

.text-grey {
  color: $text-grey;
}

.text-black {
  color: $text-black;
}
.nowrap {
  white-space: nowrap;
}
</style>
