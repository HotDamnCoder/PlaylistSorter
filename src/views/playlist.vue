<template>
  <navbar></navbar>
  <section class="section pt-3">
    <div
      class="container d-flex flex-column align-items-center justify-content-center"
    >
      <div class="row">
        <h1 class="text-center" v-if="playlist_name">Playlist "{{ playlist_name }}" from {{ playlist_type }}</h1>
      </div>
      <div class="row pt-3">
        <img
          class="img-fluid img-thumbnail rounded"
          :src="thumbnail_url"
          v-if="thumbnail_url"
        />
      </div>
      <div class="row pt-3">
        <div class="col-md-auto">
          <button vtype="button" class="btn btn-primary btn-lg" @click="goToTagging()">Tag it</button>
        </div>
        <div class="col-md-auto">
          <button type="button" class="btn btn-primary btn-lg" @click="goToConverting()">Convert it</button>
        </div>
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
/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineComponent } from "vue";
import navbar from "@/components/navbar.vue"; // @ is an alias to /src
import { ipcRenderer } from "electron";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  AUTH_URL,
} from "@/assets/TS/spotify_api";
import SpotifyWebApi from "spotify-web-api-node";
import { loginToGoogle, getPlaylistInfo } from "@/assets/TS/google_api";

export default defineComponent({
  data() {
    return {
      thumbnail_url: "",
      playlist_name: "",
      playlist_id: this.$route.query.playlist_id as string,
      playlist_type: this.$route.query.playlist_type as string,
    };
  },
  components: {
    navbar,
  },
  methods: {
    goToConverting(){
      this.$router.push({name:"converting"});
    },
    goToTagging(){
      this.$router.push({name:"tagging"})
    }
  },

  beforeMount() {
    this.playlist_type = this.playlist_type.charAt(0).toUpperCase() + this.playlist_type.substring(1)
    if (this.playlist_type === "youtube") {
      loginToGoogle(this.$gapi).then((loginResponse) => {
        if (loginResponse.hasGrantedScopes) {
          getPlaylistInfo(this.$gapi, this.playlist_id).then(
            (playlist_info: any) => {
              this.playlist_name = playlist_info.snippet.title;
              this.thumbnail_url = playlist_info.snippet.thumbnails.medium.url;
            }
          );
        }
      });
    } else {
      const SPOTIFY_API = new SpotifyWebApi({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: REDIRECT_URI,
      });
      ipcRenderer.on("spotify_oauth", (_event, access_token) => {
        SPOTIFY_API.setAccessToken(access_token);
        SPOTIFY_API.getPlaylist(this.playlist_id).then(
          (data: any) => {
            this.playlist_name = data["body"]["name"];
            this.thumbnail_url = data["body"]["images"][1]["url"];
          },
          function (err: any) {
            console.log("Something went wrong!", err);
          }
        );
      });
      window.open(AUTH_URL);
    }
  },
});
</script>
