<template>
  <div class="view-box">
    <div class="background">
      <div class="test-container">
        <ju-form :form="form">
          <template #file>
            <el-upload
              ref="uploadRef"
              v-model:file-list="fileList"
              class="upload-demo"
              action="#"
              accept=".xlsx"
              :limit="1"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleChange"
            >
              <el-button type="primary" :disabled="!form.dataSourceId">
                <el-icon class="el-icon--right mr-10"><Upload /></el-icon>
                文件上传</el-button
              >
              <template #tip>
                <div class="el-upload__tip">仅支持单个xlsx文件上传</div>
                <el-text
                  style="font-size: 12px"
                  v-if="fileFlag === true"
                  type="primary"
                  >文件解析成功</el-text
                >
                <el-text
                  style="font-size: 12px"
                  v-if="fileFlag === false"
                  type="danger"
                  >文件解析失败</el-text
                >
              </template>
            </el-upload>
          </template>
          <template #_action>
            <el-button type="primary" @click="handleTest()" :loading="loading"
              >开始测试</el-button
            >
          </template>
        </ju-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Test } from "@/entity/test";
import {
  ElMessage,
  ElUpload,
  type UploadFile,
  type UploadFiles,
} from "element-plus";
import { exportToExcel, getCurrentTime, parseXlsxFile } from "@/utils/tools";
import TestService from "@/service/module/test";

const form = reactive<any>(
  new Test({
    mode: "test",
    span: 24,
  })
);

// 文件上传
const fileList = ref<UploadFiles>([]);
const dataList = ref<any[]>([]);
const uploadRef = ref<InstanceType<typeof ElUpload> | null>(null);
const fileFlag = ref<any>("");

// 解析TXT文件内容
const parseTxtFile = (content: string): Record<string, string>[] => {
  const lines = content.trim().split(/\r?\n/);

  if (lines.length === 0) {
    ElMessage.warning("文件内容为空");
    return [];
  }

  // 获取表头 (第一行)
  const headers = lines[0].split("\t").map((header) => header.trim());

  // 处理数据行
  const result: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split("\t").map((val) => val.trim());

    // 确保列数匹配
    if (values.length !== headers.length) {
      ElMessage.warning(
        `第 ${i + 1} 行列数不匹配 (${values.length}列，应为${headers.length}列)`
      );
      continue;
    }

    // 创建数据对象
    const rowData: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index];
    });

    result.push(rowData);
  }

  return result;
};
// 文件变更处理
const handleChange = async (file: UploadFile) => {
  fileFlag.value = "";
  // 验证文件大小
  if (file.size && file.size > 10 * 1024 * 1024) {
    ElMessage.warning("文件大小不可以超过10MB");
    removeFile(file);
    return;
  }

  // xlsx 文件解析逻辑
  const rawFile = file.raw;
  if (!rawFile) {
    ElMessage.error("无法获取文件内容");
    return;
  }
  try {
    const jsonData = await parseXlsxFile(rawFile);
    dataList.value = jsonData;
    fileFlag.value = true;
  } catch (error) {
    fileFlag.value = false;
    ElMessage.error("解析xlsx失败");
  } finally {
    removeFile(file);
  }

  // 以下为txt文件解析逻辑
  // 确保获取到原始文件对象
  // const rawFile = file.raw;
  // if (!rawFile) {
  //   ElMessage.error("无法获取文件内容");
  //   return;
  // }

  // // 使用FileReader读取文件
  // const reader = new FileReader();

  // reader.onload = (e) => {
  //   try {
  //     const content = e.target?.result as string;
  //     if (!content) {
  //       throw new Error("文件内容为空");
  //     }

  //     // 解析文件内容
  //     dataList.value = parseTxtFile(content);

  //     if (dataList.value.length === 0) {
  //       ElMessage.info("未解析到有效数据");
  //     } else {
  //       ElMessage.success(`成功解析 ${dataList.value.length} 条记录`);
  //     }
  //   } catch (error) {
  //     console.error("文件解析失败:", error);
  //     ElMessage.error(`解析失败: ${(error as Error).message}`);
  //   } finally {
  //     // 清除文件选择
  //     removeFile(file);
  //   }
  // };

  // reader.onerror = () => {
  //   ElMessage.error("文件读取失败");
  //   removeFile(file);
  // };

  // reader.readAsText(rawFile);
};

// 移除文件
const removeFile = (file: UploadFile) => {
  if (uploadRef.value) {
    uploadRef.value.handleRemove(file);
  }
  fileList.value = [];
};

const loading = ref(false);
const handleTest = async () => {
  if (dataList.value.length === 0 || !form.dataSourceId || !form.productId) {
    ElMessage.warning("请先填写所有数据");
    return;
  }
  loading.value = true;
  // 这里可以添加发送数据到API的逻辑
  const params = {
    dataSourceId: form.dataSourceId,
    dataList: dataList.value,
  };
  const res = await TestService.manualRun(params);
  loading.value = false;
  if (res.success) {
    const headers = ["序号", "结果"];
    const exportList: any[] = [];
    res.data.forEach((item: any, index: number) => {
      const arr = [];
      arr.push(index + 1);
      arr.push(JSON.stringify(item));
      exportList.push(arr);
    });
    exportToExcel(
      exportList,
      headers,
      "测试结果_" + getCurrentTime("YYYYMMDD_HHmmss")
    );
    ElMessage.success("测试成功");
  } else {
    ElMessage.error("测试失败: " + res.msg);
  }
};
</script>
<style lang="scss" scoped>
.test-container {
  width: 500px;
}
.background {
  background: #fff;
  height: 100%;
  padding: 40px 20px;
  border-radius: 5px;
}
</style>
