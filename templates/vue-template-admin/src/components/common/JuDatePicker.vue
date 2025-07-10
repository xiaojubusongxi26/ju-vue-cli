<template>
  <el-date-picker
    v-model="form[item.prop as any]"
    :type="type"
    :value-format="valueFormat"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
  />
</template>

<script lang="ts">
export default {
  name: "JuDatePicker",
};
</script>
<script setup lang="ts">
import { ref } from "vue";

const { form, config, type, item } = defineProps([
  "form",
  "config",
  "type",
  "item",
]);

const valueFormat = ref("YYYY-MM-DD");

if (["date", "dates", "daterange"].includes(type)) {
  valueFormat.value = "YYYY-MM-DD";
} else if (["datetime", "datetimerange", "doubledatetime"].includes(type)) {
  valueFormat.value = "YYYY-MM-DD HH:mm:ss";
} else if (["month", "monthrange"].includes(type)) {
  valueFormat.value = "YYYY-MM";
} else {
  valueFormat.value = "";
}

const startPlaceholder = ref("");
const endPlaceholder = ref("");
if (type === "daterange") {
  startPlaceholder.value = "开始日期";
  endPlaceholder.value = "结束日期";
} else if (type === "datetimerange") {
  startPlaceholder.value = "开始时间";
  endPlaceholder.value = "结束时间";
}
</script>
<style lang="scss" scoped></style>
