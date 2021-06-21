<template>
  <button :type="btnType" class="btn btn-lg" @click="$emit('onClick')">
    {{ btnText }}
  </button>
</template>
<style lang="scss" scoped>
@import "@/assets/CSS/main.scss";
button {
  background-color: $button-bg !important;
  color: $button-color !important ;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    btnText: {
      type: String,
      required: true,
    },
    btnType: {
      type: String,
      default: "button",
    },
  },
  emits: ["onClick"],
});
</script>
