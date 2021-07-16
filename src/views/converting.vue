<template>
  <navbar></navbar>
  <div class="container pt-5">
    <centered-container>
      <playlist-title />
    </centered-container>
    <div class="pt-3" />
    <div class="row pb-3">
      <div
        class="col d-flex flex-column align-items-center justify-content-center"
      >
        <h1 class="text-center display-6">{{ playlistType }}</h1>
      </div>
      <div
        class="
          col-md-auto
          pt-3
          text-center
          d-flex
          flex-column
          align-items-center
          justify-content-center
        "
      >
        <h1>></h1>
      </div>
      <div
        class="col d-flex flex-column align-items-center justify-content-center"
      >
        <h1 class="text-center display-6">{{ alternativePlaylistType }}</h1>
      </div>
    </div>
    <div v-for="(item, index) in playlistItems" :key="item.name">
      <div class="row">
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
        <div
          class="
            col-md-auto
            pt-3
            text-center
            d-flex
            flex-column
            align-items-center
            justify-content-center
          "
        >
          <h1>></h1>
        </div>
        <div
          class="
            col
            pt-3
            text-center
            d-flex
            flex-column
            align-items-center
            justify-content-center
          "
        >
          <label for="exampleDataList" class="form-label"
            >Spotify alternative</label
          >
          <input
            class="form-control"
            :list="index"
            placeholder="Type to search..."
          />
          <datalist :id="index">
            <option
              v-for="searchItem in alternativePlaylistItems[index]"
              :key="searchItem.author + ' - ' + searchItem.name"
            >
              {{ searchItem.name }}
            </option>
          </datalist>
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
import { defineComponent } from "vue";
import navbar from "@/components/Navbar.vue";
import CenteredContainer from "@/components/CenteredContainer.vue";
import PlaylistTitle from "@/components/PlaylistTitle.vue";
import VideoPreview from "@/components/VideoPreview.vue";
import { mapGetters, mapMutations } from "vuex";
import { IPlaylistAPI } from "@/assets/TS/IPlaylistAPI";
import { Video } from "@/assets/TS/Video";
import { YoutubeAPI } from "@/assets/TS/YoutubeAPI";
import { SpotifyAPI } from "@/assets/TS/SpotifyAPI";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPE,
} from "@/assets/TS/credentials";
export default defineComponent({
  components: {
    navbar,
    CenteredContainer,
    PlaylistTitle,
    VideoPreview,
  },
  data() {
    return {
      alternativePlaylistItems: [] as Array<Array<Video>>,
    };
  },
  computed: {
    playlistItems: function (): Array<Video> {
      return this.$store.getters.getPlaylistItems() as Array<Video>;
    },
    alternativePlaylistAPI: function (): IPlaylistAPI {
      switch (this.playlistType.toLowerCase()) {
        case "youtube":
          return new YoutubeAPI(this.$gapi);
        default:
          return new SpotifyAPI(
            SPOTIFY_CLIENT_ID,
            SPOTIFY_CLIENT_SECRET,
            SPOTIFY_SCOPE,
            SPOTIFY_REDIRECT_URI
          );
      }
    },
    playlistAPI: function (): IPlaylistAPI {
      return this.$store.getters.getPlaylistAPI() as IPlaylistAPI;
    },
    playlistType: function (): string {
      return this.$store.getters.getPlaylistID().type;
    },
    alternativePlaylistType: function (): string {
      switch (this.playlistType.toLowerCase()) {
        case "youtube":
          return "Spotify";
        default:
          return "Youtube";
      }
    },
    ...mapGetters(["getPlaylistID"]),
  },
  methods: {
    ...mapMutations(["setPlaylistItems"]),
    async getAlternativePlaylistItems(): Promise<Array<Array<Video>>> {
      let alternativePlaylistItems = [];
      for (const itemIndex in this.playlistItems) {
        const item = this.playlistItems[itemIndex];
        const alternativeItems = await this.alternativePlaylistAPI.search(item);
        alternativePlaylistItems.push(alternativeItems);
      }
      return alternativePlaylistItems;
    },
  },
  async mounted() {
    await this.playlistAPI
      .getPlaylistVideos(this.getPlaylistID().id)
      .then(async (items) => {
        this.setPlaylistItems(items);
        this.alternativePlaylistItems =
          await this.getAlternativePlaylistItems();
      })
      .catch((error) => {
        alert(`Failed to get playlist videos: "${error.message}`);
      });
  },
});
</script>
