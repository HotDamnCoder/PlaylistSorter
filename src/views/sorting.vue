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
          <video-preview :item="item" />
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
            <h5>{{ item.name }}</h5>
          </div>
          <div class="row pt-3">
            <vue-tags-input
              modelValue=""
              :tags="item.tags"
              @tags-changed="(newTags) => updateItemTags(item, newTags)"
            />
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
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import VueTagsInput from "@/components/vue-tags-input/vue-tags-input.vue";
import PlaylistTitle from "@/components/PlaylistTitle.vue";
import CenteredContainer from "@/components/CenteredContainer.vue";
import StyledButton from "@/components/StyledButton.vue";
import VideoPreview from "@/components/VideoPreview.vue";
import { mapGetters, mapMutations } from "vuex";
import { IPlaylistAPI } from "@/assets/TS/IPlaylistAPI";
import { Video } from "@/assets/TS/Video";
import Store from "electron-store";

const store = new Store();

export default defineComponent({
  components: {
    Navbar,
    VueTagsInput,
    PlaylistTitle,
    CenteredContainer,
    StyledButton,
    VideoPreview,
  },
  computed: {
    playlistItems: function (): Array<Video> {
      return this.$store.getters.getPlaylistItems() as Array<Video>;
    },
    playlistAPI: function (): IPlaylistAPI {
      return this.$store.getters.getPlaylistAPI() as IPlaylistAPI;
    },
    ...mapGetters(["getPlaylistID"]),
  },
  methods: {
    updateItemTags(
      item: Video,
      newTags: Array<{ text: string; tiClasses: Array<string> }>
    ) {
      item.tags = newTags;
      //* Stores tags in a JSON in local storage with the key being the items id
      store.set(item.id, item.tags);
    },
    async startSorting() {
      const sortedPlaylists: { [index: string]: Array<string> } = {};
      //* Creates playlists based on tags, where playlist's name is the tag and items are video ids
      for (const itemIndex in this.playlistItems) {
        const item = this.playlistItems[itemIndex];
        for (const tagIndex in item.tags) {
          const tag = item.tags[tagIndex].text;
          if (tag in sortedPlaylists) {
            sortedPlaylists[tag].push(item.id);
          } else {
            sortedPlaylists[tag] = [item.id];
          }
        }
      }
      for (const playlistName in sortedPlaylists) {
        const playlistItems = sortedPlaylists[playlistName];
        //*  Creates a list of unique playlist items
        const uniquePlaylistItems = playlistItems.filter((item, itemIndex) => {
          return playlistItems.indexOf(item) === itemIndex;
        });
        let playlistId: string;
        try {
          playlistId = await this.playlistAPI.getPlaylistIdFromName(
            playlistName
          );
        } catch (error) {
          alert(`Failed to get playlist id from name: ${error.message}`);
          return null;
        }
        if (playlistId === "") {
          await this.playlistAPI
            .createPlaylist(playlistName)
            .then((createdPlaylistId: string) => {
              playlistId = createdPlaylistId;
            })
            .catch((error) => {
              alert(`Failed to created new playlist: ${error.message}`);
              return null;
            });
        } else {
          await this.playlistAPI
            .getPlaylistVideos(playlistId)
            .then((videos: Array<Video>) => {
              //* This part removes already existing videos in playlist from uniquePlaylistItems
              for (const videoIndex in videos) {
                const video = videos[videoIndex];
                if (uniquePlaylistItems.includes(video.id)) {
                  const duplicateIndex = playlistItems.indexOf(video.id);
                  uniquePlaylistItems.splice(duplicateIndex, 1);
                }
              }
            })
            .catch((error) => {
              alert(`Failed to get sorted playlist videos: ${error.message}`);
              return null;
            });
        }
        if (uniquePlaylistItems.length > 0) {
          this.playlistAPI
            .addItemsToPlaylist(playlistId, uniquePlaylistItems)
            .catch((error) => {
              console.log(error);
              alert(`Failed to add videos to playlist: "${error.message}"`);
              return null;
            });
        }
      }
    },
    ...mapMutations(["setPlaylistItems"]),
  },
  mounted() {
    this.playlistAPI
      .getPlaylistVideos(this.getPlaylistID().id)
      .then((items) => {
        this.setPlaylistItems(items);
      })
      .catch((error) => {
        alert(`Failed to get playlist videos: "${error.message}`);
      });
  },
});
</script>
