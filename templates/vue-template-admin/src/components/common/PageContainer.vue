<template>
  <div class="page-container">
    <div v-if="queryVisible" class="page-query part-box">
      <slot name="query"></slot>
    </div>
    <div
      v-for="upper in upperSlots"
      :key="upper as any"
      class="page-upper part-box"
      :class="['mb-' + gutters, 'pd-' + padding]"
    >
      <slot :name="upper"></slot>
    </div>
    <div class="page-body part-box" :class="['pd-' + padding]">
      <slot></slot>
    </div>
    <div
      v-for="down in downSlots"
      class="page-down part-box"
      :class="['mt-' + gutters, 'pd-' + padding]"
    >
      <slot :name="down"></slot>
    </div>
    <div
      v-if="footerVisible"
      class="page-footer"
      :class="[
        'mt-' + gutters,
        'pd-' + padding,
        { 'footer-fixed': footerFixed },
      ]"
    >
      <slot name="footer"></slot>
    </div>
    <div v-if="footerFixed"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PageContainer",
};
</script>
<script setup lang="ts">
const props = defineProps({
  gutters: {
    type: Number,
    default: 2,
  },
  queryVisible: {
    type: Boolean,
    default: true,
  },
  footerVisible: {
    type: Boolean,
    default: true,
  },
  footerFixed: {
    type: Boolean,
    default: false,
  },
  upperSlots: {
    type: Array,
    default: () => [],
  },
  downSlots: {
    type: Array,
    default: () => [],
  },
  padding: {
    type: Number,
    default: 20,
  },
});
</script>
<style lang="scss" scoped>
.page-container {
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  border-radius: 6px;
  margin: auto;
}

.part-box {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 5px;
}

.page-body {
  margin-top: 20px;
}

.page-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 5px;
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
</style>
