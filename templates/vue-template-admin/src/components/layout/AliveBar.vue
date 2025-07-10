<template>
  <div class="pl-10 pr-10 alive-bg">
    <div class="alive-bar">
      <div
        class="tag fs-14 flex-center cs-p ml-10"
        :class="{ tag_select: activeRoute?.name === '首页' }"
        @click="goPage('/home')"
      >
        首页
      </div>
      <div
        class="tag fs-14 flex-center cs-p ml-10"
        v-for="(r, index) in tagsList"
        :key="'tag' + r.name"
        :class="{ tag_select: activeRoute?.name === r.name }"
        @click="goPage(r.fullPath)"
      >
        {{ r.name }}
        <span
          class="ml-4 flex-center close"
          @click.stop="removeAliveRoute(r.fullPath, index)"
          ><el-icon><Close /></el-icon
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  aliveRoutes,
  activeRoute,
  goPage,
  removeAliveRoute,
} from "@/hooks/useSelfRouter";
import type { menuModel } from "@/module";
import { ref, watchEffect } from "vue";

const tagsList = ref<menuModel[]>();
watchEffect(() => {
  tagsList.value = aliveRoutes.value.filter((r) => r.path !== "/home");
});
</script>
<style lang="scss" scoped>
.alive-bg {
  background: #fafbff;
  border-bottom: 1px solid var(--theme-color-hover);
}
.alive-bar {
  height: 50px;
  width: 100%;
  overflow: scroll;
  @include flex(flex, flex-start, center);

  .tag {
    padding: 5px 8px;
    border-radius: 20px;
    white-space: nowrap;
    background: rgba($color: #e2e2e2, $alpha: 0.3);
    &:hover {
      background-color: var(--theme-color-hover);
      color: var(--theme-color);
      .close {
        width: 12px;
        height: 12px;
        display: flex;
        padding: 2px;
      }
    }
    .close {
      transition: 0.1s all;
      height: 0;
      width: 0;
      overflow: hidden;
      box-sizing: content-box;
      border-radius: 20px;
      &:hover {
        color: #fff;
        background-color: var(--color_error);
      }
    }
  }
  .tag_hover,
  .tag_select {
    background-color: var(--theme-color-hover);
    color: var(--theme-color);
  }
}
</style>
