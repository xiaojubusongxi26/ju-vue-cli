import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style/index.scss";
import "./style/each.scss";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import CommonComponents from "./components";
import IconSvg from "./icons";
import vSubmit from "@/directives/v-submit";
import SoftDialog from "./components/option/SoftDialog.vue";

const app = createApp(App);

app.directive("submit", vSubmit);

app.use(CommonComponents);
app.use(IconSvg);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("SoftDialog", SoftDialog);

app.mount("#app");
