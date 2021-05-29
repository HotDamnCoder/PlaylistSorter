<template>
  <navbar></navbar>
  <section class="section">
    <div
      class="container d-flex flex-column align-items-center justify-content-center"
    >
      <div class="row">
        <img
          class="img-fluid img-thumbnail rounded"
          src="@/assets/placeholder.jpg"
        />
      </div>
      <div class="row">
        <h1>{{ playlist_id }}</h1>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.container,
.section {
  height: 100%;
}
</style>
<script >
import { defineComponent } from "vue";
import navbar from "@/components/navbar.vue"; // @ is an alias to /src

export default defineComponent({
  data() {
    return {
      playlist_id: this.$route.query.playlist_id,
    };
  },
  components: {
    navbar,
  },
});


</script>