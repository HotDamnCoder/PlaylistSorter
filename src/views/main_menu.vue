<template>
  <centered-container>
    <div class="row">
      <h1 class="display-1">Playlist fucker</h1>
    </div>
    <div class="row pt-3">
      <form @submit="validateForm" novalidate="true">
        <div class="input-group">
          <input
            v-bind:class="{ 'is-invalid': error }"
            v-model="url"
            class="form-control"
            placeholder="Type in playlist url here"
          />
          <styled-button btnText="Submit" btnType="submit" />
        </div>
        <div class="invalid-feedback" v-if="error">
          <b>{{ error }}</b>
        </div>
      </form>
    </div>
  </centered-container>
</template>

<style lang="scss" scoped>
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
import CenteredContainer from "@/components/CenteredContainer.vue";
import StyledButton from "@/components/StyledButton.vue";
import { PlaylistId } from "@/assets/TS/PlaylistID";
import { mapMutations } from "vuex";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_SCOPE,
  SPOTIFY_REDIRECT_URI,
} from "@/assets/TS/credentials";
import { IPlaylistAPI } from "@/assets/TS/IPlaylistAPI";
import { SpotifyAPI } from "@/assets/TS/SpotifyAPI";
import { YoutubeAPI } from "@/assets/TS/YoutubeAPI";

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
        const playlistId = new PlaylistId(this.url);
        this.setPlaylistID(playlistId);
        var playlistAPI: IPlaylistAPI;
        try {
          switch (playlistId.type.toLowerCase()) {
            case "youtube":
              playlistAPI = new YoutubeAPI(this.$gapi);
              break;
            default:
              playlistAPI = new SpotifyAPI(
                SPOTIFY_CLIENT_ID,
                SPOTIFY_CLIENT_SECRET,
                SPOTIFY_SCOPE,
                SPOTIFY_REDIRECT_URI
              );
          }
          this.setPlaylistAPI(playlistAPI);
          playlistAPI
            .loginToAPI()
            .then((logedIn) => {
              if (logedIn) {
                this.$router.push("playlist");
              } else {
                alert("You're not logged in! Try again!");
              }
            })
            .catch((error) => {
              alert(error.message);
            });
        } catch (error) {
          alert(`Failed to initialize playlist API: ${error.message}`);
          return;
        }
      } catch (error) {
        this.error = error.message;
      }
    },
    ...mapMutations(["setPlaylistID", "setPlaylistAPI"]),
  },
  components: {
    CenteredContainer,
    StyledButton,
  },
});
</script>
