<template>
  <navbar></navbar>
  <div class="container pt-3">
    <playlist-title />
    <div v-for="item in playlistItems" :key="item.name" class="d-table-row">
      <div class="row">
        <div class="col">
          <img
            class="img-fluid img-thumbnail rounded"
            :src="item.thumbnails.medium"
          />
        </div>
        <div
          class="
            col
            text-center
            d-flex
            flex-column
            align-items-center
            justify-content-center
          "
        >
          <div class="row">
            {{ item.name }}
          </div>
          <div class="row pt-3">
            <vue-tags-input
              :tags="item.tags"
              @tags-changed="(newTags) => updateItemTags(item, newTags)"
            />
          </div>
        </div>
      </div>
    </div>
    <centered-container>
      <button
        type="button"
        class="btn btn-primary btn-lg"
        @click="startSorting()"
      >Sort songs to playlists based on tags
      </button>
    </centered-container>
  </div>
</template>

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
const store = new Store()

export default defineComponent({
  components: {
    navbar,
    VueTagsInput,
    PlaylistTitle,
    CenteredContainer
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
    updateItemTags (item: Video, newTags: Array<{text: string, tiClasses: Array<string>}>) {
      item.tags = newTags
      store.set(item.id, item.tags)
    },
    startSorting () {
      const sortedPlaylists: {[index: string]: Array<string>} = {}
      for (const itemIndex in this.playlistItems) {
        const item = this.playlistItems[itemIndex]
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
