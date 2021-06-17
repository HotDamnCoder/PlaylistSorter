<template>
  <div class="row pb-3">
    <h1 class="text-center" v-if="playlistName">
      {{ playlistName }}
    </h1>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  computed: {
    playlistName: function () {
      return this.$store.getters.getPlaylistName() as string
    }
  }
})
</script>
