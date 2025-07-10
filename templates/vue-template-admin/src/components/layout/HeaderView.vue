<template>
  <div class="header-bar fs-14">
    <div class="header-left">
      <div class="collapse"></div>
      <div class="pages">
        <span class="cs-p" @click="setActiveRoute('/home')">首页 </span>
        <span v-if="activeRoute?.path !== '/home'">
          {{ " > " + activeRoute?.frontName + " > " + activeRoute?.name }}</span
        >
      </div>
    </div>
    <div class="header-right flex-center">
      <img
        class="avatar none-all"
        src="https://xiaojubusongoss.oss-cn-beijing.aliyuncs.com/img/202506221309877.png"
        alt=""
      />
      <el-dropdown placement="bottom">
        <div>
          <div class="ml-10 fs-16 cs-p">{{ userInfo.username }}</div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item>修改密码</el-dropdown-item> -->
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { activeRoute, setActiveRoute } from "@/hooks/useSelfRouter";
import useApp from "@/hooks/useApp";
import { useRouter } from "vue-router";

const router = useRouter();
const { userInfo, logout } = useApp;

const handleLogout = () => {
  logout();
  router.push({ path: "/login" });
};
</script>
<style lang="scss" scoped>
.header-bar {
  width: 100%;
  height: var(--el-header-height);
  display: flex;
  align-items: center;
  .header-left {
    flex: 1;
  }
  .avatar {
    width: 40px;
    height: 40px;
    object-fit: cover;
    object-position: center;
    border-radius: 45px;
  }
}
</style>
