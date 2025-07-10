import {
  activeRoute,
  allRoutes,
  fetchDynamicRoutes,
  resetRoutes,
  routesMap,
  setActiveRoute,
} from "@/hooks/useSelfRouter";
import type { menuModel } from "./../module/index";
import { createRouter, createWebHistory } from "vue-router";
const modules = import.meta.glob(`../views/module/**/*.vue`);
const _import = (url: string) => modules[`../views/module${url}.vue`];

const routes = [
  {
    path: "/",
    name: "Main",
    component: () => import("@/views/IndexView.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/IndexView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as any,
});

router.beforeEach(async (to: any, _from: any, next: any) => {
  if (!activeRoute.value) {
    // 初始化路由数据
    await initRoutes();
    await setActiveRoute(to.fullPath);
  }
  next();
});

export async function initRoutes() {
  await fetchDynamicRoutes();
  function deepMenu(menus: menuModel[]) {
    menus.forEach((menu) => {
      if (menu.children?.length) {
        deepMenu(menu.children);
      } else {
        router.addRoute("Main", {
          name: menu.name,
          path: menu.fullPath,
          meta: menu.meta,
          component: _import(menu.fullPath + "/IndexView"),
        });
        routesMap.value[menu.fullPath] = menu;
      }
    });
  }
  deepMenu(allRoutes.value);
  router.addRoute({
    path: "/:pathMatch(.*)",
    redirect: "/home",
  });
}

// 重新刷新路由
export async function refreshRouter() {
  // 清空并重新加载路由
  await resetRoutes();
  await initRoutes();
  setActiveRoute(router.currentRoute.value.fullPath); // 重新激活当前页
}

export default router;
