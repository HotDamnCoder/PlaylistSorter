<template>
  <div class="d-inline-block position-relative">
    <thumbnail :thumbnailURL="item.thumbnails.high" />
    <play-button @onClick="openVideoPreview(item)" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Thumbnail from "@/components/Thumbnail.vue";
import PlayButton from "@/components/PlayButton.vue";
import { Video } from "@/assets/TS/Video";
export default defineComponent({
  components: {
    Thumbnail,
    PlayButton,
  },
  methods: {
    openVideoPreview(video: Video) {
      window.open(video.link);
    },
  },
  props: {
    item: {
      type: Video,
      required: true,
    },
  },
});
</script>
