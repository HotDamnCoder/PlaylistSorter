<template>
  <navbar></navbar>
  <centered-container>
      <playlist-title/>
      <div class="row">
        <img
          class="img-fluid img-thumbnail rounded"
          :src="playlistThumbnailURL"
          v-if="playlistThumbnailURL"
        />
      </div>
      <div class="row pt-3">
        <div class="col-md-auto">
          <button
            type="button"
            class="btn btn-primary btn-lg"
            @click="goToSorting()"
          >
            Sort it
          </button>
        </div>
        <div class="col-md-auto">
          <button
            type="button"
            class="btn btn-primary btn-lg"
            @click="goToConverting()"
          >
            Convert it
          </button>
        </div>
      </div>
  </centered-container>
</template>

<style lang="scss" scoped>
.container,
.section {
  height: 100%;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import navbar from '@/components/Navbar.vue' // @ is an alias to /src
import PlaylistTitle from '@/components/PlaylistTitle.vue'
import CenteredContainer from '@/components/CenteredContainer.vue'
import { IPlaylistAPI } from '@/assets/TS/IPlaylistAPI'
import { SpotifyAPI } from '@/assets/TS/SpotifyAPI'
import { YoutubeAPI } from '@/assets/TS/YoutubeAPI'
import { mapMutations, mapGetters } from 'vuex'

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPE } from '@/assets/TS/credentials'

export default defineComponent({
  computed: {
    playlistThumbnailURL: function () {
      return this.$store.getters.getPlaylistThumbnailURL() as string
    },
    ...mapGetters(['getPlaylistID'])
  },
  components: {
    navbar,
    PlaylistTitle,
    CenteredContainer
  },
  methods: {
    ...mapMutations(['setPlaylistAPI', 'setPlaylistName', 'setPlaylistThumbnailURL']),
    goToConverting () {
      this.$router.push('converting')
    },
    goToSorting () {
      return this.$router.push('sorting')
    }
  },
  mounted () {
    var playlistAPI: IPlaylistAPI
    if (this.getPlaylistID().type.toLowerCase() === 'youtube') {
      playlistAPI = new YoutubeAPI(this.$gapi)
    } else {
      playlistAPI = new SpotifyAPI(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_SCOPE, SPOTIFY_REDIRECT_URI)
    }
    this.setPlaylistAPI(playlistAPI)
    playlistAPI.loginToAPI().then((logedIn) => {
      if (logedIn) {
        playlistAPI.getPlaylistInfo(this.getPlaylistID().id).then((info) => {
          this.setPlaylistName(info.name)
          this.setPlaylistThumbnailURL(info.thumbnails.high)
        })
      }
    })
  }
})
</script>
