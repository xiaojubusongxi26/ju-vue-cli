<template>
  <div class="main-container">
    <el-container>
      <el-aside>
        <sidebar-view></sidebar-view>
      </el-aside>
      <el-container>
        <el-header>
          <header-view></header-view>
        </el-header>
        <alive-bar></alive-bar>
        <el-main>
          <router-view v-slot="{ Component, route }">
            <keep-alive :key="aliveRoutes.length + ''">
              <component :is="Component" :key="route.name" />
            </keep-alive>
            <!-- <component
              :is="Component"
              :key="route.name"
              v-if="!$route.meta.keepAlive"
            /> -->
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import SidebarView from "@/components/layout/SidebarView.vue";
import HeaderView from "@/components/layout/HeaderView.vue";
import AliveBar from "@/components/layout/AliveBar.vue";
import { aliveRoutes } from "@/hooks/useSelfRouter";
</script>
<style lang="scss" scoped>
.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  .el-aside {
    width: auto;
  }
  .el-header {
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .el-main {
    padding: 0;
  }
}
</style>
