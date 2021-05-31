<template>
  <section class="section">
    <div
      class="container d-flex flex-grow-1 flex-column align-items-center justify-content-center"
    >
      <div class="row">
        <h1>Playlist fucker</h1>
      </div>
      <div class="row mt-3">
        <form @submit="validateForm" novalidate="true">
          <label class="form-label">Type in playlist url</label>
          <div class="input-group">
            <input
              v-bind:class="{ 'is-invalid': error }"
              v-model="url"
              class="form-control"
            />
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
          <div class="invalid-feedback" v-if="error">
            <b>{{ error }}</b>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container,
.section {
  height: 100%;
}

.container > * {
  width: 100% !important;
  text-align: center;
}

.invalid-feedback {
  display: block;
  text-align: left;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { PlaylistId } from "@/assets/TS/PlaylistID";

export default defineComponent({
  data() {
    return {
      error: "",
      url: "",
    };
  },
  methods: {
    validateForm(e: { preventDefault: () => void }) {
      e.preventDefault(); //*  Prevents default form action
      this.error = "";
      try {
        let playlist_id = new PlaylistId(this.url);
        this.$router.push({
          name: "playlist",
          query: {
            playlist_id: playlist_id.id,
            playlist_type: playlist_id.type,
          },
        });
      } catch (error) {
        this.error = error.message;
      }
    },
  },
});
</script>
