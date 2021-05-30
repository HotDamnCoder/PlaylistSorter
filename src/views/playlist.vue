<template>
  <navbar></navbar>
  <section class="section">
    <div
      class="
        container
        d-flex
        flex-column
        align-items-center
        justify-content-center
      "
    >
      <div class="row">
        <img class="img-fluid img-thumbnail rounded" :src="url"/>
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

<script lang="js">
import { defineComponent } from "vue";
import navbar from "@/components/navbar.vue"; // @ is an alias to /src
var SpotifyWebApi = require('spotify-web-api-node');


var scopes = ['user-read-private', 'user-read-email'],
  redirectUri = 'https://example.com/callback',
  clientId = '***REMOVED***',
  state = 'Estonia';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);


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
  methods:{
    login(){
      this.$gapi.login().then(({ currentUser, hasGrantedScopes }) => {
          console.log({ currentUser, hasGrantedScopes })
        })
    },
    fuck(){
      console.log(this.$gapi);
      this.$gapi.getGapiClient().then((gapi) =>{
        gapi.client.youtube.playlists.list({
          "part": ["snippet,contentDetails"],
          "id": [this.playlist_id]
        }).then((response) => {
          console.log(response.result)
          this.url = response.result.items[0].snippet.thumbnails.high.url;
          });
      });
    }
  }
});
</script>
