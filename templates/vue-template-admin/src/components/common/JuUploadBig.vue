<template>
  <div>
    <div @click="() => (dialogVisible = true)">
      <slot></slot>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="大文件上传"
      width="500"
      @close="closeDialog"
    >
      <el-upload
        ref="uploadRef"
        v-model="fileList"
        class="upload-demo"
        drag
        action="#"
        v-bind="props"
        :auto-upload="false"
        :on-preview="handlePreview"
        :on-change="handleChange"
        :on-remove="setUploadSchedule"
        :limit="1"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处或者<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            <div v-if="props.accept">
              支持的文件类型为:
              <span class="text-theme">{{ props.accept }}</span>
            </div>
            <div v-if="uploadSchedule.status" class="mt-10 mb-10">
              <el-progress
                :percentage="uploadSchedule.percentage"
                :status="
                  uploadSchedule.status === 'uploading'
                    ? ''
                    : uploadSchedule.status
                "
              />
            </div>
            <div class="flex-center-v">
              <el-icon><Warning /></el-icon>
              <span class="ml-4">大文件上传单次只能上传一个文件</span>
            </div>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: "JuUploadBig",
};
</script>
<script setup lang="ts">
import { calculateFileHash, createFileChunks } from "@/utils/file";
import { FilePost, Get, Post } from "@/utils/request";
import {
  ElMessage,
  type UploadFile,
  type UploadFiles,
  type UploadRequestOptions,
} from "element-plus";
import { nextTick, reactive, ref } from "vue";

const props = defineProps({
  url: String,
  limit: {
    type: [Number, String],
    default: 1,
  },
  headers: {
    type: Object,
    default: () => ({}),
  },
  size: {
    type: Number,
    default: 50 * 1024 * 1024,
  },
  accept: {
    type: String,
    default: "",
  },
});
const uploadRef = ref();
const dialogVisible = ref(false);
const fileList = ref<UploadFiles>([]);
const uploadSchedule = reactive({
  percentage: 0,
  status: "",
  total: 0,
  uploadedCount: 0,
});

// TODO:文件预览
const handlePreview = (file: File) => {
  console.log("file:", file);
};

// 上传状态初始化
const setUploadSchedule = () => {
  uploadSchedule.percentage = 0;
  uploadSchedule.status = "";
  uploadSchedule.total = 0;
  uploadSchedule.uploadedCount = 0;
};

// 上传切片
const uploadChunksRequest = async (formData: FormData) => {
  return new Promise(async (resolve) => {
    const res: any = await FilePost("/uploadChunk", formData, props.headers);
    resolve(res);
  });
};

// 发送合并请求，获得文件url
const mergeRequest = async (name: string, hash: string) => {
  // TODO
  const res = await Post("/mergeChunk", {
    name,
    hash,
  });
  console.log("文件合并成功", res);
};

// 获取已上传的chunk索引列表
const getUploadedChunks = async (name: string, hash: string) => {
  const res = await Get("/getUploadedChunk", {
    name,
    hash,
  });
  return res.data;
};

const handleChange = async (uploadFile: UploadFile, files: UploadFiles) => {
  // 获得切片
  const fileChunks = createFileChunks(uploadFile);

  // 获取hash
  const hash: string = await calculateFileHash(fileChunks);

  // 准备上传切片
  uploadSchedule.total = fileChunks.length;
  uploadSchedule.uploadedCount = 0;
  uploadSchedule.status = "uploading";
  uploadSchedule.percentage = 0;

  // 获取已上传的分块索引列表
  const uploadedChunks = await getUploadedChunks(uploadFile.name, hash);
  const len = uploadedChunks.length;
  if (len) {
    uploadSchedule.uploadedCount = len;
    uploadSchedule.percentage = Math.floor(
      (uploadSchedule.uploadedCount / uploadSchedule.total) * 100
    );
  }

  if (len !== uploadedChunks.length) {
    // 上传切片并合并
    const uploadPromises = fileChunks
      .map((file, index) => {
        const formData = new FormData();
        formData.append("chunk", file);
        formData.append("key", `${hash}_${uploadFile.name}_${index}`);
        formData.append("hash", `${hash}`);
        formData.append("index", index.toString());
        formData.append("name", uploadFile.name);
        return formData;
      })
      .filter((formData) => {
        // 过滤出不存在于已上传列表的分块
        const index = formData.get("index");
        return !uploadedChunks.includes(Number(index));
      })
      .map(async (formData) => {
        // 将切片上传
        const res: any = await uploadChunksRequest(formData);
        const index = formData.get("index");

        if (res.data) {
          uploadSchedule.uploadedCount++;
          uploadSchedule.percentage = Math.floor(
            (uploadSchedule.uploadedCount / uploadSchedule.total) * 100
          );
          return {
            index,
            status: "success",
          };
        } else {
          return {
            index,
            status: "error",
          };
        }
      });

    await Promise.all(uploadPromises);
  }

  setTimeout(() => {
    uploadSchedule.status =
      uploadSchedule.uploadedCount === uploadSchedule.total
        ? "success"
        : "exception";
  }, 200);
  await mergeRequest(uploadFile.name, hash);
};

const closeDialog = () => {
  uploadRef.value.clearFiles();
  fileList.value = [];
  setUploadSchedule();
  dialogVisible.value = false;
};
</script>
<style lang="scss" scoped></style>
