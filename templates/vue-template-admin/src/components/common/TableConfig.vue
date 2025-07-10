<template>
  <el-popover :width="200" trigger="hover">
    <div class="config-body">
      <div class="action-line">
        <el-link type="primary" @click="resetTable()">重置</el-link>
      </div>
      <el-checkbox-group v-model="visibleColumn" @change="changeVisible">
        <div class="sort-list" ref="sortRef">
          <div class="sort-item" v-for="col in columnsList" :key="col.prop">
            <icon-svg name="drag" class="drag-icon"></icon-svg>
            <el-checkbox style="flex: 1" :value="col.prop" :label="col.label">{{
              col.label
            }}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <template #reference>
      <el-dropdown trigger="contextmenu" placement="bottom-end">
        <img src="@/assets/imgs/config_setting.png" class="tb-setting" alt="" />
      </el-dropdown>
    </template>
  </el-popover>
</template>

<script lang="ts">
export default {
  name: "TableConfig",
};
</script>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Sortable from "sortablejs";
import { getTableConfig, setTableConfig } from "@/service/common";
import type { TableColumn } from "@/type/base";
import { deepClone } from "@/utils/tools";

const { table, isSort = true } = defineProps(["table", "isSort"]);
const sortRef = ref(null);
const visibleColumn = ref<string[]>([]);
const tableColumn = ref<TableColumn[]>([]);
const originTableColumn = ref<TableColumn[]>([]);

let sortableInstance;

const columnsList = computed(() => {
  return tableColumn.value;
});

// ------------------------------ 表格初始化 ------------------------------
table.id && initTableColumn();
async function initTableColumn() {
  originTableColumn.value = deepClone(table.columns);
  const { data } = await getTableConfig(table.id);
  if (data) {
    visibleColumn.value = JSON.parse(data.visibleColumn);
    tableColumn.value = JSON.parse(data.tableColumn);
    refreshTable();
  } else {
    // 初始设置表格配置
    tableColumn.value = table.columns.map((col: TableColumn, index: number) => {
      return {
        ...col,
        sortOrder: index,
      };
    });
    visibleColumn.value = table.columns.map((col: TableColumn) => col.prop);
    setTable();
  }
}
async function setTable() {
  const params = {
    tableId: table.id,
    visibleColumn: JSON.stringify(visibleColumn.value),
    tableColumn: JSON.stringify(tableColumn.value),
  };
  await setTableConfig(params);
}

// ------------------------------ column操作 ------------------------------
// 可见更改
function changeVisible() {
  setTable();
  refreshTable();
}
// 更新表格渲染
function refreshTable() {
  table.columns = tableColumn.value.filter((col) => {
    return visibleColumn.value.includes(col.prop);
  });
}

function draggle() {
  sortableInstance = new Sortable(sortRef.value, {
    draggable: ".sort-item",
    handle: ".drag-icon",
    dragClass: "sortable-drag",
    chosenClass: "sortable-chosen",
    direction: "vertical",
    onEnd: async (evt: { oldIndex: number; newIndex: number }) => {
      console.log(evt);
      const { oldIndex, newIndex } = evt;
      // 交换元素位置
      tableColumn.value[oldIndex].sortOrder = newIndex;
      tableColumn.value[newIndex].sortOrder = oldIndex;
      insertAtIndex(oldIndex, newIndex);
      // 更新元素位置
      refreshTable();
      setTable();
      console.log("新的元素：", tableColumn.value);
    },
  });
}

// 插入元素
function insertAtIndex(oldIndex: number, newIndex: number) {
  const [moveEl] = tableColumn.value.splice(oldIndex, 1);
  tableColumn.value.splice(newIndex, 0, moveEl);
}

function resetTable() {
  tableColumn.value = deepClone(originTableColumn.value);
  visibleColumn.value = originTableColumn.value.map((col) => col.prop);
  refreshTable();
  setTable();
}

onMounted(() => {
  if (isSort) {
    draggle();
  }
});
</script>
<style lang="scss" scoped>
.config-body {
  .action-line {
    text-align: right;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
  }
}
.tb-setting {
  width: 21px;
  cursor: pointer;
  color: #303133;

  &:focus {
    outline: none;
  }
}
.drag-icon {
  width: 20px !important;
  height: 20px !important;
  cursor: pointer;
  color: #303133;
}
.sort-list {
  margin-top: 5px;
  .sort-item {
    display: flex;
    align-items: center;
    color: #000;
    height: 30px;
  }
}
.sortable-drag {
  background-color: #f5f5f5;
  border-radius: 5px;
}

.sortable-chosen {
  background-color: var(--theme-color-hover);
  border-radius: 5px;
}
</style>
