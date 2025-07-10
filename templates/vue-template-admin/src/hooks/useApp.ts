import { reactive, ref } from "vue";

const isCollapse = ref(false); // 导航栏折叠控制
const webOptions = reactive({
  title: "Ju-Admin",
});
const userInfo = ref({
  userId: "",
  username: "",
});

// 退出登录
const logout = () => {
  userInfo.value = {
    userId: "",
    username: "",
  };
};

export default {
  isCollapse,
  webOptions,
  userInfo,
  logout,
};
