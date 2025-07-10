<template>
  <el-select
    class="ju-select"
    v-model="form[item.prop as any]"
    @change="changeHandle"
    :collapse-tags-tooltip="item.element.collapseTags"
    :collapse-tags="item.element.collapseTags"
  >
    <template #header v-if="config && config.all">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="indeterminate"
        @change="handleCheckAll"
      >
        全选
      </el-checkbox>
    </template>
    <el-option
      v-for="op in dataList"
      :key="op[config.valueTarget] || op.value"
      :label="op[config.labelTarget] || op.label"
      :value="op[config.valueTarget] || op.value"
      :disabled="op.disabled"
    >
    </el-option>
  </el-select>
</template>

<script lang="ts">
export default {
  name: "JuSelect",
};
</script>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchDataDic } from "@/service/common";
import { Get, Post } from "@/utils/request";

const { form, config, item } = defineProps(["form", "config", "item"]);
const emit = defineEmits(["itemChange"]);

const indeterminate = ref(false);
const checkAll = ref(false);
const isMultiple = ref(false);
const dataList = ref(item.list || []);

// ------------------------------ 初始化数据 ------------------------------
isMultiple.value = item.element?.multiple || false;

function initData() {
  if (config?.key) {
    getDataDict(config.key);
  } else if (config?.url) {
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
}
initData();

// 绑定的key变化，重新加载数据
watch(
  item.key,
  () => {
    initData();
  },
  {
    deep: true,
  }
);

async function getDataDict(key: string) {
  const { data } = await fetchDataDic({ key });
  dataList.value = data;
}

async function getDataByUrl() {
  let res = undefined;
  if (config?.method === "POST" || config?.method === "post") {
    res = await Post(
      config.url,
      typeof config.params === "function" ? config.params() : config.params
    );
  } else {
    res = await Get(
      config.url,
      typeof config.params === "function" ? config.params() : config.params
    );
  }
  dataList.value = res.data;
}

watch(
  () => form[item.prop],
  (val) => {
    if (config.all) {
      if (form[item.prop]?.length === 0) {
        indeterminate.value = false;
        checkAll.value = false;
      } else if (form[item.prop].length === item.list.length) {
        indeterminate.value = false;
        checkAll.value = true;
      } else {
        indeterminate.value = true;
        checkAll.value = false;
      }
    }
  }
);

const handleCheckAll = (val: any) => {
  indeterminate.value = false;
  if (val) {
    form[item.prop] = dataList.value.map((_: any) => _.value);
  } else {
    form[item.prop] = [];
  }
};
const changeHandle = (val: any) => {
  let current = undefined;
  if (isMultiple.value && val?.length) {
    current = dataList.value
      .filter((_: any) => val.includes(_[config.valueTarget] || _.value))
      .map((_: any) => _);
  } else if (val) {
    current = dataList.value.find(
      (row: any) => row[config.valueTarget] === val || row["value"] === val
    );
  }
  emit("itemChange", val, current, dataList.value);
};
</script>
<style lang="scss" scoped></style>
