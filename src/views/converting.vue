<template>
  <navbar></navbar>
  <div class="about">
    <h1>This ispage2</h1>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import navbar from "@/components/navbar.vue";
export default defineComponent({
  components: {
    navbar,
  }
});
</script>
