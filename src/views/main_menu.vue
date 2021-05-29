<template>
  <section class="section">
    <div
      class="
        container
        d-flex
        flex-grow-1 flex-column
        align-items-center
        justify-content-center
      "
    >
      <div class="row">
        <h1>Playlist fucker</h1>
      </div>
      <div class="row mt-3">
        <form @submit="validateForm" novalidate="true">
          <label class="form-label">Type in playlist url</label>
          <div class="input-group">
            <input
              v-bind:class="{ 'is-invalid': error }"
              v-model="url"
              class="form-control"
            />
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
          <div class="invalid-feedback" v-if="error">
            <b>{{ error }}</b>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container,
.section {
  height: 100%;
}

.container > * {
  width: 100% !important;
  text-align: center;
}

.invalid-feedback {
  display: block;
  text-align: left;
}
</style>

<script lang="js">
import { defineComponent } from "vue";

const default_error_message = "Invalid url";
const url_re = /(PLjc__[\w\d]{28})|([\w\d]{22})/g; //! Fix this regex

function getIDfromURL(url) {
  var matches = url.match(url_re);
  if (!matches || matches.length > 1) {
    return "";
  } else {
    return matches[0];
  }
}

export default defineComponent({
  data() {
    return {
      error: "",
      url: "",
    };
  },
  methods: {
    validateForm(e) {
      e.preventDefault();
      this.error = "";
      var playlist_id = getIDfromURL(this.url);
      if (!playlist_id) {
        this.error = default_error_message;
      } else {
        this.$router.push({
          name: "playlist",
          query: { playlist_id: playlist_id },
        });
      }
    },
  },
});
</script>
