<template>
  <navbar></navbar>
  <section class="section">
    <div
      class="container d-flex flex-column align-items-center justify-content-center"
    >
      <div class="row">
        <img
          class="img-fluid img-thumbnail rounded"
          :src="thumbnail_url"
          v-if="thumbnail_url"
        />
      </div>
      <div class="row">
        <h1 v-if="playlist_name">{{ playlist_name }}</h1>
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

<script lang="ts">
import { defineComponent } from "vue";
import navbar from "@/components/navbar.vue"; // @ is an alias to /src

export default defineComponent({
  data() {
    return {
      thumbnail_url: "",
      playlist_name: "",
      playlist_id: this.$route.query.playlist_id,
      playlist_type: this.$route.query.playlist_type,
    };
  },
  components: {
    navbar,
  },
  methods: {
    loginToGoogle() {
      return this.$gapi.login();
    },
    loginToSpotify(){console.log()},
    getPlaylistThumbnail() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.youtube.playlists
          .list({
            part: ["snippet"],
            id: [this.playlist_id],
          })
          .then(
            (response: {
              result: {
                items: {
                  snippet: {
                    thumbnails: { medium: { url: string } };
                    title: string;
                  };
                }[];
              };
            }) => {
              this.playlist_name = response.result.items[0].snippet.title;
              this.thumbnail_url =
                response.result.items[0].snippet.thumbnails.medium.url;
            }
          );
      });
    },
  },
  beforeMount() {
    this.loginToGoogle().then(this.getPlaylistThumbnail)
  },
});
</script>
