<template>
  <navbar></navbar>
  <section class="section pt-3">
    <div
      class="
        flex-grow-1
        container
        d-flex
        flex-column
        align-items-center
        justify-content-center
      "
    >
      <div class="row">
        <h1 class="text-center" v-if="playlistName">
          Playlist "{{ playlistName }}" from {{ playlistType }}
        </h1>
      </div>
      <div class="row pt-3">
        <img
          class="img-fluid img-thumbnail rounded"
          :src="playlistThumbnailURL"
          v-if="playlistThumbnailURL"
        />
      </div>
      <div class="row pt-3">
        <div class="col-md-auto">
          <button
            vtype="button"
            class="btn btn-primary btn-lg"
            @click="goToTagging()"
          >
            Tag it
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
import { defineComponent } from 'vue'
import navbar from '@/components/navbar.vue' // @ is an alias to /src
import { IPlaylistAPI } from '@/assets/TS/IPlaylistAPI'
import { SpotifyAPI } from '@/assets/TS/SpotifyAPI'
import { YoutubeAPI } from '@/assets/TS/YoutubeAPI'
import { mapMutations, mapGetters } from 'vuex'

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPE } from '@/assets/TS/credentials'

export default defineComponent({
  computed: {
    playlistID: function () {
      return this.$store.getters.getPlaylistID().id as string
    },
    playlistType: function () {
      return this.$store.getters.getPlaylistID().type as string
    },
    playlistName: function () {
      return this.$store.getters.getPlaylistName() as string
    },
    playlistThumbnailURL: function () {
      return this.$store.getters.getPlaylistThumbnailURL() as string
    },
    ...mapGetters(['getPlaylistAPI'])
  },
  components: {
    navbar
  },
  methods: {
    ...mapMutations(['setPlaylistAPI', 'setPlaylistName', 'setPlaylistThumbnailURL']),
    goToConverting () {
      this.$router.push('converting')
    },
    goToTagging () {
      return this.$router.push('tagging')
    }
  },
  mounted () {
    if (this.getPlaylistAPI()) {
      var playlistAPI: IPlaylistAPI
      if (this.playlistType.toLowerCase() === 'youtube') {
        playlistAPI = new YoutubeAPI(this.$gapi)
      } else {
        playlistAPI = new SpotifyAPI(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_SCOPE, SPOTIFY_REDIRECT_URI)
      }
      this.setPlaylistAPI(playlistAPI)
      playlistAPI.loginToAPI().then((logedIn) => {
        if (logedIn) {
          playlistAPI.getPlaylistInfo(this.playlistID).then((info) => {
            this.setPlaylistName(info.name)
            this.setPlaylistThumbnailURL(info.thumbnails.high)
          })
        }
      })
    }
  }
})
</script>
