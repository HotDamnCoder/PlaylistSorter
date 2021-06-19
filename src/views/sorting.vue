<template>
  <navbar></navbar>
  <div class="container">
    <playlist-title/>
    <div class="pt-3"/>
    <div v-for="item in playlistItems" :key="item.name" class="d-table-row">
      <div class="row">
        <div class="col pt-3" style="position: relative;">
              <thumbnail :thumbnailURL="item.thumbnails.high"/>
              <play-button @onClick="openVideoPreview(item)"/>
        </div>
        <div class="col text-center d-flex flex-column align-items-center justify-content-center">
          <div class="row">
            <h5>{{ item.name }}</h5>
          </div>
          <div class="row pt-3">
            <vue-tags-input modelValue="" :tags="item.tags" @tags-changed="(newTags) => updateItemTags(item, newTags)"
            />
          </div>
        </div>
      </div>
    </div>
    <centered-container>
      <styled-button btnText="Sort songs to playlists based on tags" @onClick="startSorting()"/>
    </centered-container>
    <div class="pb-3"/>
  </div>
</template>
<style lang="scss" scoped>
.container{
  padding-top: 48px;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'
import navbar from '@/components/Navbar.vue'
import VueTagsInput from '@/components/vue-tags-input/vue-tags-input.vue'
import PlaylistTitle from '@/components/PlaylistTitle.vue'
import CenteredContainer from '@/components/CenteredContainer.vue'
import { mapGetters, mapMutations } from 'vuex'
import { IPlaylistAPI } from '@/assets/TS/IPlaylistAPI'
import { Video } from '@/assets/TS/Video'
import Store from 'electron-store'
import StyledButton from '@/components/StyledButton.vue'
import Thumbnail from '@/components/Thumbnail.vue'
import PlayButton from '@/components/PlayButton.vue'
const store = new Store()

export default defineComponent({
  components: {
    navbar,
    VueTagsInput,
    PlaylistTitle,
    CenteredContainer,
    StyledButton,
    Thumbnail,
    PlayButton
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
    openVideoPreview (video: Video) {
      window.open(video.link)
    },
    updateItemTags (item: Video, newTags: Array<{text: string, tiClasses: Array<string>}>) {
      item.tags = newTags
      store.set(item.id, item.tags)
    },
    startSorting () {
      const sortedPlaylists: {[index: string]: Array<string>} = {}
      for (const itemIndex in this.playlistItems) {
        const item = this.playlistItems[itemIndex]
        console.log(item)
        for (const tagIndex in item.tags) {
          const tag = item.tags[tagIndex].text
          if (tag in sortedPlaylists) {
            sortedPlaylists[tag].push(item.id)
          } else {
            sortedPlaylists[tag] = [item.id]
          }
        }
      }
      console.log(sortedPlaylists)
      for (const playlistName in sortedPlaylists) {
        const playlistItems = sortedPlaylists[playlistName]
        if (!this.playlistAPI.checkIfPlaylistExists(playlistName)) {
          this.playlistAPI.createPlaylist(playlistName)
        }
        this.playlistAPI.addItemsToPlaylist(playlistName, playlistItems)
      }
    },
    ...mapMutations(['setPlaylistItems'])
  },
  mounted () {
    this.playlistAPI.getPlaylistVideos(this.getPlaylistID().id).then((items) => {
      console.log(items)
      this.setPlaylistItems(items)
    })
  }
})
</script>
