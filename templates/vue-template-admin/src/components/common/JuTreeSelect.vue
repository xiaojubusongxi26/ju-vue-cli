<template>
  <el-tree-select
    v-model="form[item.prop as any]"
    :data="dataList"
  ></el-tree-select>
</template>

<script lang="ts">
export default {
  name: "JuTreeSelect",
};
</script>
<script setup lang="ts">
import { Get, Post } from "@/utils/request";
import { ref, watch } from "vue";
const { form, config, item } = defineProps(["form", "config", "item"]);

const dataList: any = ref();

if (config?.url) {
  if (config.params) {
    // 依赖数据发生变化重新请求数据
    watch(
      () => config.params,
      () => {
        getDataByUrl();
      },
      {
        deep: true,
      }
    );
  }
  getDataByUrl();
}

async function getDataByUrl() {
  let res = undefined;
  if (config?.method === "POST" || config?.method === "post") {
    res = await Post(config.url, config.params);
  } else {
    res = await Get(config.url, config.params);
  }
  dataList.value = handleData(res.data);
}

const handleData = (data: any) => {
  data.forEach((inner: any) => {
    inner.value = inner[config.valueTarget || "value"];
    inner.label = inner[config.labelTarget || "label"];
    if (inner.children?.length) {
      inner.children = handleData(inner.children);
    }
  });
  return data;
};
</script>
<style lang="scss" scoped></style>
