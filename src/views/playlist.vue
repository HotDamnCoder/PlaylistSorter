<template>
  <navbar></navbar>
  <section class="section">
    <div
      class="container d-flex flex-column align-items-center justify-content-center"
    >
      <div class="row">
        <img class="img-fluid img-thumbnail rounded" :src="url" />
      </div>
      <div class="row">
        <h1>{{ playlist_id }}</h1>
      </div>
    </div>
  </section>
  <button v-on:click="login()">***REMOVED***</button>
  <button v-on:click="fuck()">fuck</button>
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
      url: "",
      playlist_id: this.$route.query.playlist_id,
    };
  },
  components: {
    navbar,
  },
  methods: {
    login() {
      this.$gapi.login().then(({ currentUser, hasGrantedScopes }) => {
        console.log({ currentUser, hasGrantedScopes });
      });
    },
    fuck() {
      console.log(this.$gapi);
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.youtube.playlists
          .list({
            part: ["snippet,contentDetails"],
            id: [this.playlist_id],
          })
          .then(
            (response: {
              result: {
                items: { snippet: { thumbnails: { high: { url: string } } } }[];
              };
            }) => {
              console.log(response.result);
              this.url = response.result.items[0].snippet.thumbnails.high.url;
            }
          );
      });
    },
  },
});
</script>
