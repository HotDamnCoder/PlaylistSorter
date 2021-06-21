<template>
  <navbar></navbar>
  <div class="container pt-5">
    <centered-container>
      <playlist-title />
    </centered-container>
    <div class="pt-3" />
    <div v-for="item in playlistItems" :key="item.name">
      <div class="row">
        <div class="col pt-3">
          <div class="row">
            <video-preview :item="item" />
          </div>
          <div
            class="row
              text-center
              d-flex
              flex-column
              align-items-center
              justify-content-center
            "
          >
            <h5>{{ item.name }}</h5>
          </div>
        </div>
        <div class="col pt-3">
            <h1>></h1>
        </div>
        <div class="col pt-3">
          <div class="row">
            <video-preview :item="item" />
          </div>
          <div
            class="
              row
              text-center
              d-flex
              flex-column
              align-items-center
              justify-content-center
            "
          >
            <h5>{{ item.name }}</h5>
          </div>
        </div>
      </div>
    </div>
    <centered-container>
      <styled-button
        btnText="Sort songs to playlists based on tags"
        @onClick="startSorting()"
      />
    </centered-container>
    <div class="pb-3" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import navbar from '@/components/Navbar.vue'
import CenteredContainer from '@/components/CenteredContainer.vue'
import PlaylistTitle from '@/components/PlaylistTitle.vue'
import VideoPreview from '@/components/VideoPreview.vue'
import { mapGetters, mapMutations } from 'vuex'
import { IPlaylistAPI } from '@/assets/TS/IPlaylistAPI'
import { Video } from '@/assets/TS/Video'
export default defineComponent({
  components: {
    navbar,
    CenteredContainer,
    PlaylistTitle,
    VideoPreview
  },
  computed: {
    playlistItems: function (): Array<Video> {
      return this.$store.getters.getPlaylistItems() as Array<Video>
    },
    playlistAPI: function (): IPlaylistAPI {
      return this.$store.getters.getPlaylistAPI() as IPlaylistAPI
    },
    ...mapGetters(['getPlaylistID'])
  },
  methods: {
    ...mapMutations(['setPlaylistItems'])
  },
  mounted () {
    this.playlistAPI
      .getPlaylistVideos(this.getPlaylistID().id)
      .then(items => {
        this.setPlaylistItems(items)
      })
      .catch(error => {
        alert(`Failed to get playlist videos: "${error.message}`)
      })
  }
})
</script>
