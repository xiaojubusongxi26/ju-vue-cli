<template>
  <template v-if="props.menu.children">
    <el-sub-menu :index="props.menu.fullPath">
      <template #title>
        <el-icon><component :is="props.menu.icon"></component></el-icon>
        <span>{{ props.menu.name }}</span>
      </template>
      <template v-for="children in menu.children" :key="children.authId">
        <SubMenu :menu="children" />
      </template>
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item
      :index="props.menu.fullPath"
      @click="setActiveRoute(props.menu.fullPath)"
    >
      <el-icon><component :is="props.menu.icon"></component></el-icon>
      <span>{{ props.menu.name }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { menuModel } from "@/module";
import { setActiveRoute } from "@/hooks/useSelfRouter";

const props = defineProps<{
  menu: menuModel;
}>();
</script>
<style lang="scss" scoped></style>
