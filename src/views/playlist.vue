<template>
  <navbar></navbar>
  <centered-container>
      <playlist-title/>
      <div class="row pt-3 pb-3">
        <thumbnail :thumbnailURL="playlistThumbnailURL"/>
      </div>
      <div class="row">
        <div class="col-md-auto">
          <styled-button btnText="Sort it" @onClick="goToSorting()"/>
        </div>
        <div class="col-md-auto">
          <styled-button btnText="Convert it" @onClick="goToConverting()"/>
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
import { defineComponent } from 'vue'
import navbar from '@/components/Navbar.vue' // @ is an alias to /src
import PlaylistTitle from '@/components/PlaylistTitle.vue'
import CenteredContainer from '@/components/CenteredContainer.vue'
import StyledButton from '@/components/StyledButton.vue'
import { IPlaylistAPI } from '@/assets/TS/IPlaylistAPI'
import { SpotifyAPI } from '@/assets/TS/SpotifyAPI'
import { YoutubeAPI } from '@/assets/TS/YoutubeAPI'
import { mapMutations, mapGetters } from 'vuex'

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPE } from '@/assets/TS/credentials'
import { Playlist } from '@/assets/TS/Playlist'
import Thumbnail from '@/components/Thumbnail.vue'

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
    CenteredContainer,
    StyledButton,
    Thumbnail
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
    try {
      if (this.getPlaylistID().type.toLowerCase() === 'youtube') {
        playlistAPI = new YoutubeAPI(this.$gapi)
      } else {
        playlistAPI = new SpotifyAPI(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_SCOPE, SPOTIFY_REDIRECT_URI)
      }
      this.setPlaylistAPI(playlistAPI)
      playlistAPI.loginToAPI().then((logedIn) => {
        if (logedIn) {
          playlistAPI.getPlaylist(this.getPlaylistID().id).then((playlist: Playlist) => {
            this.setPlaylistName(playlist.name)
            this.setPlaylistThumbnailURL(playlist.thumbnails.medium)
          })
        } else {
          alert("You're not logged in!")
        }
      }).catch((error) => {
        alert(`Failed to log in: "${error.message}"`)
      })
    } catch (error) {
      alert(`Failed to initialize playlist API: ${error.message}`)
    }
  }
})
</script>
