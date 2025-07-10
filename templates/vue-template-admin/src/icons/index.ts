import IconSvg from "./IconSvg.vue";
import "virtual:svg-icons-register";

export default {
  install: (app: any) => {
    // 注册全局组件
    app.component("icon-svg", IconSvg);
  },
};
