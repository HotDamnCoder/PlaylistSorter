<template>
  <navbar></navbar>
  <centered-container>
    <playlist-title />
    <div class="row pt-3 pb-3">
      <thumbnail :thumbnailURL="playlistThumbnailURL" />
    </div>
    <div class="row">
      <div class="col-md-auto">
        <styled-button btnText="Sort it" @onClick="goToSorting()" />
      </div>
      <div class="col-md-auto">
        <styled-button btnText="Convert it" @onClick="goToConverting()" />
      </div>
    </div>
  </centered-container>
</template>
<style lang="scss" scoped>
img {
  height: 300px !important;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue"; // @ is an alias to /src
import PlaylistTitle from "@/components/PlaylistTitle.vue";
import CenteredContainer from "@/components/CenteredContainer.vue";
import StyledButton from "@/components/StyledButton.vue";
import { mapMutations, mapGetters } from "vuex";

import { Playlist } from "@/assets/TS/Playlist";
import Thumbnail from "@/components/Thumbnail.vue";
import { IPlaylistAPI } from "@/assets/TS/IPlaylistAPI";

export default defineComponent({
  computed: {
    playlistThumbnailURL: function () {
      return this.$store.getters.getPlaylistThumbnailURL() as string;
    },
    ...mapGetters(["getPlaylistID", "getPlaylistAPI"]),
  },
  components: {
    Navbar,
    PlaylistTitle,
    CenteredContainer,
    StyledButton,
    Thumbnail,
  },
  methods: {
    ...mapMutations([
      "setPlaylistAPI",
      "setPlaylistName",
      "setPlaylistThumbnailURL",
    ]),
    goToConverting() {
      this.$router.push("converting");
    },
    goToSorting() {
      return this.$router.push("sorting");
    },
  },

  async beforeMount() {
    const playlistAPI: IPlaylistAPI = this.getPlaylistAPI();
    await playlistAPI
      .getPlaylist(this.getPlaylistID().id)
      .then((playlist: Playlist) => {
        this.setPlaylistName(playlist.name);
        this.setPlaylistThumbnailURL(playlist.thumbnails.medium);
      })
      .catch(async (error) => {
        await this.$router.go(-1);
        alert(error.message);
      });
  },
});
</script>
