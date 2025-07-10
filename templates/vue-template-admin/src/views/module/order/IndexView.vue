<template>
  <div class="view-box">
    <page-container>
      <template #query>
        <!-- <ju-form :form="form">
          <template #_action>
            <el-button type="primary" @click="refreshList()">查询</el-button>
            <el-button @click="resetList()">重置</el-button>
          </template>
        </ju-form> -->
      </template>
      <padding-box>
        <el-button type="primary" @click="handleExport">
          <el-icon class="el-icon--right mr-10"><Download /></el-icon>
          导出
        </el-button>
        <template #end>
          <icon-svg
            name="refresh"
            class="fs-20 mr-20 cs-p"
            @click="refreshList()"
          ></icon-svg>
          <!-- <table-config :table="table" @sort="refreshList()"></table-config> -->
        </template>
      </padding-box>
      <ju-table
        ref="myTable"
        :table="table"
        v-loading="table.loading"
        row-key="id"
        @refresh="refreshList"
      >
        <template #productName="{ row }">
          {{ row.productName + row.dataSourceRemark }}
        </template>
      </ju-table>
      <template #footer>
        <el-pagination
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="table.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="table.pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="table.totalCount"
        />
      </template>
    </page-container>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Order, OrderTable } from "@/entity/order";
import OrderService from "@/service/module/order";
import { exportToExcel, exportToTxt, getCurrentTime } from "@/utils/tools";
import { ElMessage } from "element-plus";

const form = reactive<any>(
  new Order({
    mode: "query",
    span: 8,
  })
);
const table = reactive<any>(new OrderTable("Order-table"));

async function getDataList() {
  table.loading = false;
  const params = {
    pageNum: table.currentPage,
    pageSize: table.pageSize,
  };
  table.loading = true;
  const res = await OrderService.getList(params);
  table.loading = false;
  if (res.success) {
    table.totalCount = Number(res.data.total);
    table.list = res.data.list;
  }
}
getDataList();

const handleExport = async () => {
  const res = await OrderService.exportAll();
  const list = res.data;
  if (!list || list.length === 0) {
    ElMessage.warning("导出失败");
    return;
  }
  const exportList: any[] = [];
  list.forEach((item: any, index: number) => {
    const arr = [];
    arr.push(index + 1);
    arr.push(item.theDay);
    arr.push(item.productName + item.dataSourceRemark);
    arr.push(item.dataSourceName);
    arr.push(item.customerName);
    arr.push(item.upRequest);
    arr.push(item.upRecordBilling);
    arr.push(item.downRequest);
    arr.push(item.downRecordBilling);
    exportList.push(arr);
  });
  const headers = [
    "统计序号",
    "日期",
    "产品名称",
    "数源名称",
    "客户名称",
    "数源调用次数",
    "数源计费次数",
    "客户调用次数",
    "客户计费次数",
  ];
  exportToExcel(
    exportList,
    headers,
    `订单列表_${getCurrentTime("YYYYMMDD_HHmmss")}`
  );
  ElMessage.success("导出成功");
};

// ------------------------------ 表格通用方法 ------------------------------
// 重置表格表单请求
function resetList() {
  table.currentPage = 1;
  table.pageSize = 10;
  table.sortColumn = undefined;
  table.sortOrder = undefined;
  form.clear();
  getDataList();
}
// 刷新表格
function refreshList() {
  getDataList();
  const ref = table.getRef();
  ref.clearSelection();
}

// 表格翻页
const pageChange = (val: number) => {
  table.currentPage = val;
  getDataList();
};

// 每页数量
const sizeChange = (val: number) => {
  table.pageSize = val;
  getDataList();
};
</script>
<style lang="scss" scoped></style>
