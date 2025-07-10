<template>
  <div>
    <div @click="() => (dialogVisible = true)">
      <slot></slot>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="上传文件"
      width="500"
      @close="closeDialog"
    >
      <el-upload
        ref="uploadRef"
        v-model="fileList"
        class="upload-demo"
        drag
        action="#"
        multiple
        :auto-upload="false"
        v-bind="props"
        :on-preview="handlePreview"
        :on-change="handleChange"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处或者<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            <div v-if="props.accept">
              支持的文件类型为:
              <span class="text-theme">{{ props.accept }}</span>
            </div>
            <div>
              <span v-if="Number(props.limit) > 1" class="mr-10"
                >最多可上传<span class="text-theme"> {{ props.limit }} </span
                >个文件</span
              >
              <span
                >单个文件大小不超过
                <span class="text-theme"
                  >{{ Number(props.size / 1024 / 1024) }}MB</span
                ></span
              >
            </div>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 上传 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: "JuUpload",
};
</script>
<script setup lang="ts">
import { FilePost } from "@/utils/request";
import {
  ElMessage,
  type UploadFile,
  type UploadFiles,
} from "element-plus";
import { ref } from "vue";

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
    default: ".jpg,.png",
  },
});
const uploadRef = ref();
const loading = ref(false);
const defaultUrl = "/upload";

const dialogVisible = ref(false);
const fileList = ref<UploadFiles>([]);

// TODO:文件预览
const handlePreview = (file: File) => {
  console.log("file:", file);
};

// 文件修改
const handleChange = (file: UploadFile, files: UploadFiles) => {
  console.log("file:", file);
  // 判断文件大小是否超过最大值
  if (file.size && file.size > props.size) {
    ElMessage.warning(
      "文件大小不可以超过" + Number(props.size / 1024 / 1024) + "MB"
    );
    uploadRef.value.handleRemove(file);
    return;
  }
  fileList.value = files;
};

const closeDialog = () => {
  uploadRef.value.clearFiles();
  fileList.value = [];
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  if (loading.value) {
    return;
  }
  const formData = new FormData();
  fileList.value.forEach((file: UploadFile) => {
    formData.append("file", file.raw as any);
  });
  // 添加其他参数
  if (props.headers) {
    for (let key in props.headers) {
      formData.append(key, props.headers[key]);
    }
  }
  loading.value = true;
  const res = await FilePost(props.url || defaultUrl, formData, props.headers);
  if (res.code === 0) {
    ElMessage.success(res.message);
    closeDialog();
  } else {
    ElMessage.error(res.message);
  }
  loading.value = false;
};
</script>
<style lang="scss" scoped></style>
