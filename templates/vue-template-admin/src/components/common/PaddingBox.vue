<template>
  <div class="padding-box" :class="['pb-' + (padding || 22)]">
    <div class="content">
      <slot></slot>
    </div>
    <div class="end">
      <slot name="end"></slot>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "PaddingBox",
};
</script>
<script setup lang="ts">
const props = defineProps(["padding"]);
const { padding } = props;
</script>

<style lang="scss" scoped>
.padding-box {
  display: flex;
  justify-content: space-between;

  .content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .end {
    display: flex;
    align-items: center;
  }
}
</style>
