import { ref } from "vue";
import type { menuModel } from "../module/index";
import router from "@/router";

export const allRoutes = ref<menuModel[]>([]);
export const aliveRoutes = ref<menuModel[]>([]);
export const activeRoute = ref<menuModel>();
export const routesMap = ref<Record<string, menuModel>>({});
export const routesAliveMap = ref<Record<string, menuModel>>({});
export const defaultRoutes = ref<menuModel[]>([
  {
    authId: "0",
    name: "首页",
    path: "/home",
    fullPath: "/home",
    icon: "Promotion",
    frontPath: "/",
    frontName: "",
    parentId: "",
    orderNum: 1,
    menuType: "route",
    children: undefined,
  },
]);

export async function fetchDynamicRoutes() {
  // 静态路由
  allRoutes.value = [...defaultRoutes.value];
  // const res = await getRoutes();
  // allRoutes.value = res.data;
}

// 跳转页面
export function goPage(fullPath: string) {
  const menu = routesMap.value[fullPath];

  activeRoute.value = menu;
  // 缓存页面
  if (!aliveRoutes.value?.find((val) => val.authId === menu.authId)) {
    aliveRoutes.value.push(menu);
  }
  router.push(menu.fullPath);
}

// 设置激活路由
export function setActiveRoute(fullPath: string, isTo: boolean = true) {
  if (!routesMap.value[fullPath]) {
    // 页面不存在，默认跳转至首页
    return false;
  }
  activeRoute.value = routesMap.value[fullPath];
  setAliveRoute(fullPath);

  isTo && goPage(fullPath);
  return true;
}

// 清空缓存路由
export function clearAliveRoutes() {
  aliveRoutes.value = [];
}

// 移除缓存路由
export function removeAliveRoute(fullPath: string, index: number) {
  delete routesAliveMap.value[fullPath];
  aliveRoutes.value = aliveRoutes.value.filter(
    (item) => item.fullPath !== fullPath
  );
  // 是否清除的当前路由
  if (activeRoute.value?.fullPath === fullPath) {
    goPage("/home");
  }
}

// 设置缓存路由
export function setAliveRoute(fullPath: string) {
  if (!routesAliveMap.value[fullPath]) {
    routesAliveMap.value[fullPath] = routesMap.value[fullPath];
    aliveRoutes.value.push(routesAliveMap.value[fullPath]);
  }
}

// 重置路由
export function resetRoutes() {
  // 遍历 routesMap，移除 Main 下所有动态路由
  Object.values(routesMap.value).forEach((route) => {
    if (route.name && router.hasRoute(route.name)) {
      router.removeRoute(route.name);
    }
  });

  // 清空缓存
  routesMap.value = {};
  aliveRoutes.value = [];
  allRoutes.value = [];
  routesAliveMap.value = {};
  activeRoute.value = undefined;
}
