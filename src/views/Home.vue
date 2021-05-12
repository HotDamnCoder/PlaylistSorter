<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
});
</script>
<style lang="scss">
@import "../../node_modules/bulma/sass/utilities/_all.sass";
@import "../../node_modules/bulma/sass/base/_all.sass";
@import "../../node_modules/bulma/sass/elements/button.sass";
@import "../../node_modules/bulma/sass/elements/container.sass";
@import "../../node_modules/bulma/sass/elements/title.sass";
@import "../../node_modules/bulma/sass/form/_all.sass";
@import "../../node_modules/bulma/sass/components/navbar.sass";
@import "../../node_modules/bulma/sass/layout/hero.sass";
@import "../../node_modules/bulma/sass/layout/section.sass";
</style>
