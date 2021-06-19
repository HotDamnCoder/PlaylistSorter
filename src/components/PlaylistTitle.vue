<template>
  <div class="row">
    <h1 class="text-center display-6" v-if="playlistName">
      {{ playlistName }}
    </h1>
  </div>
</template>
<style lang="scss" scoped>
.row{
  padding-top: 48px;
}
</style>
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
