<template>
  <nav class="nav">
    <div class="nav-left">
      <BaseIcon class="logo" icon="WS_logo_text" />
    </div>
    <div class="nav-right">
      <BaseTitle1> Login </BaseTitle1>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.nav {
  width: 100%;
  display: flex;
  background-color: $white;
  justify-content: space-between;
  padding: 20px 40px;
  border-bottom: 2px solid $black;
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 100px;
}
</style>
