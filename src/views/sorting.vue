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
      this.playlistItems.forEach((item) => {
        const itemTags = localStorage.get(item.id, []) as Array<{
          text: string;
        }>;
        itemTags.forEach((tag) => {
          if (tag.text in sortedPlaylists) {
            const tagPlaylist = sortedPlaylists[tag.text];
            if (!tagPlaylist.includes(item.id)) {
              tagPlaylist.push(item.id);
            }
          } else {
            sortedPlaylists[tag.text] = [item.id];
          }
        });
      });
      return sortedPlaylists;
    },
    async createSortedPlaylists(sortedPlaylists: {
      [index: string]: Array<string>;
    }) {
      for (const playlistName in sortedPlaylists) {
        try {
          const playlistItems = sortedPlaylists[playlistName];
          let playlistId: string;
          //* Check if playlist exists (playlistId === "" if playlist doesnt exist)
          playlistId = await this.playlistAPI.getPlaylistIdFromName(
            playlistName
          );
          //* Create new playlist if it didn't exist else remove duplicates
          if (playlistId === "") {
            await this.playlistAPI
              .createPlaylist(playlistName)
              .then((createdPlaylistId: string) => {
                playlistId = createdPlaylistId;
              });
          } else {
            await this.playlistAPI
              .getPlaylistVideos(playlistId)
              .then((videos: Array<Video>) => {
                //* This part removes already existing videos in playlist from uniquePlaylistItems
                videos.forEach((video) => {
                  if (playlistItems.includes(video.id)) {
                    const duplicateIndex = playlistItems.indexOf(video.id);
                    playlistItems.splice(duplicateIndex, 1);
                  }
                });
              });
          }
          //* Add items to playlist
          if (playlistItems.length > 0) {
            await this.playlistAPI.addItemsToPlaylist(
              playlistId,
              playlistItems
            );
          }
        } catch (error) {
          alert(error.message);
        }
      }
    },
    async startSorting() {
      await this.createSortedPlaylists(this.sortIntoPlaylists());
    },
    ...mapMutations(["setPlaylistItems"]),
  },
  async beforeMount() {
    await this.playlistAPI
      .getPlaylistVideos(this.getPlaylistID().id)
      .then((items) => {
        this.setPlaylistItems(items);
      })
      .catch(async (error) => {
        this.$router.go(-1);
        alert(error.message);
      });
  },
});
</script>
