<template>
  <div class="sidebar-box">
    <div class="fs-30 color-w flex-center pt-10 fw-6">
      {{ webOptions.title }}
    </div>
    <div class="sidebar-links">
      <el-menu
        class="side-menu"
        :default-active="activeRoute?.fullPath || '/home'"
      >
        <SubMenu
          v-for="(menu, menuIndex) in allRoutes"
          :key="menu.authId + menuIndex"
          :menu="menu"
        />
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import SubMenu from "./SubMenu.vue";
import { activeRoute, allRoutes } from "@/hooks/useSelfRouter";

import useApp from "@/hooks/useApp";
const { webOptions } = useApp;
</script>
<style lang="scss" scoped>
.sidebar-box {
  height: 100%;
  width: 30%;
  min-width: 250px;
  max-width: 300px;
  background-color: #526685;
}
:deep(.sidebar-links) {
  box-sizing: border-box;
  padding: 10px;
  .el-menu {
    background: transparent !important;
    border-right: none;
    .el-sub-menu,
    .el-sub-menu__title,
    .el-menu-item {
      border-radius: 8px;
      overflow: hidden;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .el-menu-item.is-active {
      color: #fff;
      background-color: #042139;
    }
  }
}
</style>
