<template>
    <img v-if="thumbnailURL" :src="thumbnailURL" class= "img-fluid img-thumbnail rounded">
</template>
<style lang="scss" scoped>
img{
  width: 100%;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    thumbnailURL: {
      type: String,
      required: true
    }
  }
})
</script>
