<template>
  <centered-container>
      <div class="row">
        <h1 class="display-1">Playlist fucker</h1>
      </div>
      <div class="row pt-3">
        <form @submit="validateForm" novalidate="true">
          <div class="input-group">
            <input
              v-bind:class="{ 'is-invalid': error }"
              v-model="url"
              class="form-control"
              placeholder="Type in playlist url here"
            />
            <styled-button btnText="Submit" btnType="submit"/>
          </div>
          <div class="invalid-feedback" v-if="error">
            <b>{{ error }}</b>
          </div>
        </form>
      </div>
  </centered-container>
</template>

<style lang="scss" scoped>

.container > * {
  width: 100% !important;
  text-align: center;
}

.invalid-feedback {
  display: block;
  text-align: left;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import CenteredContainer from '@/components/CenteredContainer.vue'
import StyledButton from '@/components/StyledButton.vue'
import { PlaylistId } from '@/assets/TS/PlaylistID'
import { mapMutations } from 'vuex'

export default defineComponent({
  data () {
    return {
      error: '',
      url: ''
    }
  },
  methods: {
    validateForm (e: { preventDefault: () => void }) {
      e.preventDefault() //*  Prevents default form action
      this.error = ''
      try {
        this.setPlaylistID(new PlaylistId(this.url))
        this.$router.push('playlist')
      } catch (error) {
        this.error = error.message //
      }
    },
    ...mapMutations(['setPlaylistID'])
  },
  components: {
    CenteredContainer,
    StyledButton
  }
})
</script>
