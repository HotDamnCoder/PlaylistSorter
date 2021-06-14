<template>
  <navbar></navbar>
  <section class="section pt-3">
    <div class="container">
      <h1 class="text-center pb-3">
          Playlist "{{ playlistName }}" from {{ playlistType }}
        </h1>
      <div v-for="item in playlistItems" :key="item.name" class="d-table-row">
        <div class="row">
          <div class="col">
            <img
              class="img-fluid img-thumbnail rounded"
              :src="item.thumbnails.medium"
            />
          </div>
          <div class="col text-center d-flex align-items-center justify-content-center">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import navbar from '@/components/navbar.vue'
import { mapGetters, mapMutations } from 'vuex'
import { IPlaylistAPI } from '@/assets/TS/IPlaylistAPI'
import { VideoInfo } from '@/assets/TS/VideoInfo'

export default defineComponent({
  computed: {
    playlistName: function (): string {
      return this.$store.getters.getPlaylistName()
    },
    playlistType: function (): string {
      return this.$store.getters.getPlaylistID().type
    },
    playlistItems: function (): Array<VideoInfo> {
      return this.$store.getters.getPlaylistItems() as Array<VideoInfo>
    },
    ...mapGetters(['getPlaylistAPI', 'getPlaylistID', 'getPlaylistName'])
  },
  components: {
    navbar
  },
  methods: {
    ...mapMutations(['setPlaylistItems'])
  },
  mounted () {
    const api: IPlaylistAPI = this.getPlaylistAPI()
    api.getPlaylistItems(this.getPlaylistID().id).then((items) => {
      this.setPlaylistItems(items)
    })
  }
})
</script>
