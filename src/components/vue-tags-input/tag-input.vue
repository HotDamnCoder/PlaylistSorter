/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
<!-- A helper component used by VueTagsInput and can be put into the tag-center slot -->

<template>
  <input
    v-if="scope.edit"
    v-model="scopeTagText"
    :maxlength="scope.maxlength"
    type="text"
    class="ti-tag-input"
    size="1"
    @input="scope.validateTag(scope.index, $event)"
    @blur="scope.performCancelEdit(scope.index)"
    @keydown="scope.performSaveEdit(scope.index, $event)"
  >
</template>

<script>
export default {
  name: 'TagInput',
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    scopeTagText: function () {
      return this.scope.tag.text
    }
  }
}

</script>

<style lang="css" scoped>
.ti-tag-input {
  background-color: transparent;
  color: inherit;
  border: none;
  padding: 0px;
  margin: 0px;
  display: flex;
  top: 0px;
  position: absolute;
  width: 100%;
  line-height: inherit;
}

.ti-tag-input::-ms-clear {
  display: none;
}

input:focus {
  outline: none;
}

input[disabled] {
  background-color: transparent;
}
</style>
