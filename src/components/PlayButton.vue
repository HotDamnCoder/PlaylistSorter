<template>
  <div @click="$emit('onClick')" />
</template>
<style lang="scss" scoped>
div {
  cursor: pointer;
  height: 72px;
  width: 72px;
  left: 50%;
  top: 50%;
  margin-left: -36px;
  margin-top: -36px;
  position: absolute;
  background: url("~@/assets/images/playButton.png") no-repeat;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["onClick"],
});
</script>
