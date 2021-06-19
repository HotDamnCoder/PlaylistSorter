<template>
<nav class="navbar">
  <div class="container-fluid">
    <a class="navbar-brand" href="#" @click="$router.go(-1)">Go back</a>
  </div>
</nav>
</template>
<style lang="scss" scoped>
@import "@/assets/CSS/main.scss";
nav {
  background-color: $navbar-bg;
}
.navbar-brand {
  color: $navbar-color !important;
}
.navbar-brand:hover {
  color: $navbar-link-hover-color !important;
}
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
}
</style>
