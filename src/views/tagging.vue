<template>
  <navbar></navbar>
  <div class="about">
    <h1>This ispage</h1>
    <ul id="example-1">
      <li v-for="item in playlist_items" :key="item.snippet.title">
        {{ item.snippet.title}}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import navbar from "@/components/navbar.vue";
export default defineComponent({
  components: {
    navbar,
  },
  data() {
    return {
      playlist_items: this.$route.query.playlist_items as [],
    };
  },
  beforeMount(){
    console.log(this.playlist_items);
    for (let item in this.playlist_items){
      console.log(this.playlist_items[item])
    }
  }
});
</script>