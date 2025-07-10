<template>
  <el-checkbox-group v-model="form[item.prop as any]">
    <el-checkbox
      v-for="ch in dataList"
      :label="ch[config.targetLabel] || ch.label"
      :value="ch[config.targetValue] || ch.value"
      :key="ch[config.targetValue] || ch.value"
      >{{ ch[config.targetLabel] || ch.label }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script lang="ts">
export default {
  name: "JuCheckbox",
};
</script>
<script setup lang="ts">
import { fetchDataDic } from "@/service/common";
import { Get, Post } from "@/utils/request";
import { ref } from "vue";

const { form, config, item } = defineProps(["form", "config", "item"]);

const dataList = ref(item.list || []);

if (config?.key) {
  getDataDict(config.key);
} else if (config?.url) {
  getDataByUrl();
}

async function getDataDict(key: string) {
  const { data } = await fetchDataDic({ key });
  dataList.value = data;
}

async function getDataByUrl() {
  let res = undefined;
  if (config?.method === "POST" || config?.method === "post") {
    res = await Post(config.url, config.params);
  } else {
    res = await Get(config.url, config.params);
  }
  dataList.value = res.data;
}
</script>
<style lang="scss" scoped></style>
