<template>
  <el-table
    ref="JuTableRef"
    :data="table.list"
    border
    style="width: 100%"
    v-bind="{ ...table.element, ...$attrs }"
    v-on="table.events || {}"
    @row-click="rowClickHandle"
    @selection-change="selectChange"
    @sort-change="sortChange"
  >
    <el-table-column
      v-if="table.selection"
      type="selection"
      align="center"
      width="55"
    />
    <el-table-column
      v-if="table.index"
      align="center"
      type="index"
      :width="table.indexConfig?.width || 50"
      :label="table.indexConfig?.label || ''"
    />
    <el-table-column
      v-for="column in table.columns"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
      :align="column.align || 'center'"
      :sortable="
        table.sortable === false
          ? false
          : (column.sortable ?? table.sortType ?? 'custom')
      "
      v-bind="column.element"
    >
      <template v-if="column.dict" v-slot="{ row }">
        {{
          tableDictsMap[column.dict]
            ? tableDictsMap[column.dict][row[column.prop]]
            : row[column.prop]
        }}
      </template>
      <template v-else-if="slots[column.prop]" v-slot="{ row, $index }">
        <slot :name="column.prop" :row="row" :index="$index"></slot>
      </template>
    </el-table-column>

    <el-table-column
      v-if="table.operation?.operation !== false"
      align="center"
      :resizable="false"
      v-bind="table.operation"
    >
      <template #default="{ row, $index }">
        <slot name="_operation" :row="row" :index="$index"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
export default {
  name: "JuTable",
};
</script>
<script setup lang="ts">
import { fetchDataDic } from "@/service/common";
import type { TableColumn } from "@/type/base";
import { onMounted, onUnmounted, ref } from "vue";

const { table } = defineProps(["table"]);
const emit = defineEmits(["refresh"]);
const slots = defineSlots();
const JuTableRef = ref();
const tableDictsMap = ref<Record<string, any>>({});
// 收集字典，从接口或缓存中取出字典数据
table.columns && fetchTableDict();
async function fetchTableDict() {
  const dictKeys: string[] = [];
  table.columns.forEach(
    (col: TableColumn) => col.dict && dictKeys.push(col.dict)
  );
  // 根据dictKeys请求字典，封装的请求会自动拦截已经缓存的数据和自动缓存请求到的字典，所以直接从hooks中获取数据
  await dictKeys.forEach(async (key: string) => {
    const { data } = await fetchDataDic({ key });
    const obj: Record<string, any> = {};
    await data?.forEach((dic: any) => {
      const key = dic["targetValue"] || dic["value"];
      const label = dic["targetLabel"] || dic["label"];
      obj[key] = label;
    });
    tableDictsMap.value[key] = obj;
  });
}

function rowClickHandle(row: any, column: any, event: Event) {
  if (column.label !== "操作") {
    if (table.selecedData.length > 1) {
      table.selecedData = [];
      JuTableRef.value.clearSelection();
    } else if (table.selecedData.length === 1 && table.selecedData[0] === row) {
      table.selecedData = [];
      JuTableRef.value.toggleRowSelection(row, false);
    } else {
      table.selecedData = [row];
      JuTableRef.value.clearSelection();
      JuTableRef.value.toggleRowSelection(row, true);
    }
  }
}
function selectChange(rows: any) {
  table.selecedData = rows;
}
function sortChange(data: { column: any; prop: string; order: any }) {
  if (table.sortType !== true) {
    table.sortColumn = data.prop;
    if (data.order === "ascending") {
      table.sortOrder = "asc";
    } else if (data.order === "descending") {
      table.sortOrder = "desc";
    } else {
      table.sortOrder = null;
    }
    emit("refresh");
  }
}

onMounted(() => {
  table.getRef = () => JuTableRef.value;
});

onUnmounted(() => {
  table.getRef = undefined;
});
</script>
<style lang="scss" scoped></style>
