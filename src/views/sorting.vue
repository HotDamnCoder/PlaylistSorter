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
              :tags="storage.get(item.id, [])"
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

const localStorage = new Store();

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
    storage: function () {
      return localStorage;
    },
    ...mapGetters(["getPlaylistID"]),
  },
  methods: {
    updateItemTags(
      item: Video,
      newTags: Array<{ text: string; tiClasses: Array<string> }>
    ) {
      //* Stores tags in a JSON in local storage with the key being the items id
      localStorage.set(item.id, newTags);
    },
    sortIntoPlaylists() {
      const sortedPlaylists: { [index: string]: Array<string> } = {};
      //* Creates playlists based on tags, where playlist's name is the tag and items are video ids
      for (const itemIndex in this.playlistItems) {
        const item = this.playlistItems[itemIndex];
        const itemTags = localStorage.get(item.id, []) as Array<{
          text: string;
        }>;
        for (const tagIndex in itemTags) {
          const tag = itemTags[tagIndex].text;
          if (tag in sortedPlaylists) {
            const tagPlaylist = sortedPlaylists[tag];
            if (!tagPlaylist.includes(item.id)) {
              tagPlaylist.push(item.id);
            }
          } else {
            sortedPlaylists[tag] = [item.id];
          }
        }
      }
      return sortedPlaylists;
    },
    async createSortedPlaylists(sortedPlaylists: {
      [index: string]: Array<string>;
    }) {
      for (const playlistName in sortedPlaylists) {
        const playlistItems = sortedPlaylists[playlistName];
        let playlistId: string;
        //* Check if playlist exists (playlistId === "" if playlist doesnt exist)
        try {
          playlistId = await this.playlistAPI.getPlaylistIdFromName(
            playlistName
          );
        } catch (error) {
          alert(`Failed to get playlist id from name: ${error.message}`);
          return null;
        }
        //* Create new playlist if it didn't exist else remove every item that already exists in the playlist
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
                if (playlistItems.includes(video.id)) {
                  const duplicateIndex = playlistItems.indexOf(video.id);
                  playlistItems.splice(duplicateIndex, 1);
                }
              }
            })
            .catch((error) => {
              alert(`Failed to get sorted playlist videos: ${error.message}`);
              return null;
            });
        }
        //* Add items to playlist
        if (playlistItems.length > 0 && playlistId !== "") {
          await this.playlistAPI
            .addItemsToPlaylist(playlistId, playlistItems)
            .catch((error) => {
              console.log(error);
              alert(`Failed to add videos to playlist: "${error.message}"`);
              return null;
            });
        }
      }
    },
    async startSorting() {
      await this.createSortedPlaylists(this.sortIntoPlaylists());
    },
    ...mapMutations(["setPlaylistItems"]),
  },
  async mounted() {
    await this.playlistAPI
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
