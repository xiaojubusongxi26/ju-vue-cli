<template>
  <el-dialog
    :title="props.title"
    v-model="dialogVisible"
    :width="props.width"
    :before-close="close"
  >
    <slot></slot>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "提示",
  },
  width: {
    type: String,
    default: "500",
  },
});
const emit = defineEmits(["submit", "close"]);
const dialogVisible = defineModel("visible");

const submit = async () => {
  await emit("submit");
  close();
};
const close = () => {
  emit("close");
  dialogVisible.value = false;
};
</script>
<style lang="scss" scoped></style>
