<template>
  <el-form
    ref="formRef"
    :model="form"
    :label-width="labelWidth()"
    @keyup.enter.native="enterSubmit()"
    @submit.native.prevent
  >
    <el-row>
      <template v-for="item in formList" :key="item.prop">
        <el-col :span="item.span" v-if="(item.show && item.show()) ?? true">
          <el-form-item
            :label="item.label"
            :label-width="labelWidth(item.labelWidth)"
            :prop="item.prop"
            :rules="item.refRules"
          >
            <div class="ju-item-inner">
              <template v-if="!!$slots[item.prop]">
                <slot :name="item.prop"></slot>
              </template>
              <template v-else>
                <el-input
                  v-if="item.type === 'input'"
                  v-model="form[item.prop as any]"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                ></el-input>
                <el-input-number
                  :class="{ 'like-input': item.element?.controls === false }"
                  v-else-if="item.type === 'input-number'"
                  v-model="form[item.prop as any]"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                  style="width: 100%"
                ></el-input-number>
                <el-input
                  v-if="item.type === 'textarea'"
                  v-model="form[item.prop as any]"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                  type="textarea"
                ></el-input>
                <el-radio-group
                  v-else-if="item.type === 'radio'"
                  v-model="form[item.prop as any]"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                >
                  <el-radio
                    v-for="ra in item.list"
                    :label="ra.value"
                    :key="ra.value"
                  >
                    {{ ra.label }}
                  </el-radio>
                </el-radio-group>
                <ju-checkbox
                  v-else-if="item.type === 'checkbox'"
                  :form="form"
                  :config="item.config"
                  :item="item"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                >
                </ju-checkbox>
                <ju-select
                  v-else-if="
                    item.type === 'select' ||
                    item.type === 'url-select' ||
                    item.type === 'dict-select'
                  "
                  :form="form"
                  :config="item.config"
                  :item="item"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                >
                </ju-select>
                <ju-tree-select
                  v-else-if="item.type === 'tree-select'"
                  :form="form"
                  :config="item.config"
                  :item="item"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                >
                </ju-tree-select>
                <ju-date-picker
                  v-else-if="item.type === 'date-picker'"
                  :form="form"
                  :config="item.config"
                  :item="item"
                  :type="item.element.type"
                  v-bind="item.element"
                  v-on="item.events"
                  :disabled="item.disabled && item.disabled()"
                >
                </ju-date-picker>
              </template>
            </div>
          </el-form-item>
        </el-col>
      </template>
      <el-col v-if="opts.queryVisible !== false" :span="searchSpan">
        <el-form-item label-width="0">
          <div class="query-action">
            <div>
              <slot name="_action"></slot>
            </div>
            <span
              class="collapsible"
              v-if="opts.collapsible"
              @click="doCollapse()"
            >
              {{ isCollapse ? "展开" : "收起" }}
              <icon-svg
                name="down"
                :class="[isCollapse ? '' : 'rotate']"
              ></icon-svg>
            </span>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "JuForm",
};
</script>
<script setup lang="ts">
import type { FormItem, FormItemOption } from "@/type/base";
import { computed, onMounted, onUnmounted, ref, useSlots, watch } from "vue";
import { setUpperFirst } from "@/utils/tools";

const { form } = defineProps<{
  form: any;
}>();
const emit = defineEmits(["enter"]);
const $slot = useSlots();
const slotName = ref<string[]>([]);

const formList = ref<FormItemOption[]>([]);
const sourceFormList: FormItemOption[] = [];
const opts = form._opts || {};
const isCollapse = ref(true);
const formRef = ref();

const labelWidth = computed(() => {
  const defaultWidth = 120;
  return (width?: number) => {
    return `${width || defaultWidth}px`;
  };
});

let formKeys = Object.keys(form);
formKeys.forEach((prop) => {
  // 动态插槽
  if ($slot[prop]) {
    slotName.value.push(prop);
  }
  if (form["get" + setUpperFirst(prop)]) {
    let field: FormItem = form["get" + setUpperFirst(prop)]();
    if (["query", "search"].includes(opts.mode)) {
      if (field.query) {
        Object.assign(field, field.query);
      } else if (field.search) {
        Object.assign(field, field.search);
      }
    }
    field.rules = field.rules || [];
    field.refRules = ref(field.rules);
    field.show = field.show || (() => true);
    field.key = field.key || (() => prop);
    field.disabled = field.disabled || (() => false);
    const placeholderStart = ["input", "textarea"].includes(field.type)
      ? "请输入"
      : "请选择";
    const placeholder =
      placeholderStart + field.label.replace(":", "").replace("：", "");
    if (!["query", "search"].includes(opts.mode)) {
      if (field.required) {
        watch(field.required, (val) => {
          if (val) {
            field.refRules.value.push({
              required: true,
              message: placeholder,
              trigger: "blur",
            });
          } else {
            field.refRules.value = field.refRules.value.filter(
              (res: any) => !res.required
            );
          }
        });
      }
      field.required = field.required || (() => false);
      if (field.required()) {
        field.refRules.value.push({
          required: true,
          message: placeholder,
          trigger: "blur",
        });
      }
    } else {
      field.refRules.value = field.refRules.value.filter(
        (res: any) => !res.required
      );
    }
    if (!field.element) {
      field.element = {
        clearable: true,
        placeholder: placeholder,
      };
      if (opts.placeholder === false) {
        field.element.placeholder = "";
      }
    } else {
      field.element.placeholder = field.element.placeholder || placeholder;
      field.element.clearable =
        typeof field.element.clearable === "undefined"
          ? true
          : field.element.clearable;
      if (opts.placeholder === false) {
        field.element.placeholder = "";
      }
    }
    // 改写events
    if (field.events?.change) {
      const defaultChange = field.events.change;
      field.events.change = (value: any) => {
        defaultChange(value, field.list);
      };
    }
    const item = {
      prop,
      type: field.type,
      label: field.label,
      span: field.span || opts.span,
      labelWidth: field.labelWidth || opts.labelWidth,
      show: field.show,
      key: field.key,
      disabled: field.disabled,
      required: field.required,
      refRules: field.refRules,
      element: field.element,
      events: field.events || {},
      list: field.list || {},
      config: field.config || {},
    };
    if (opts.mode) {
      if (field.mode && field.mode.includes(opts.mode)) {
        formList.value.push(item);
        sourceFormList.push(item);
      }
    } else {
      formList.value.push(item);
      sourceFormList.push(item);
    }
  }
});

//计算按钮所占span
let toalSpan = 0;
const searchSpan = ref(0);
const spans: number[] = [];
formList.value.forEach((res) => {
  if (!res.show || res.show() !== false) {
    let curSpan = res.span || opts.span;
    spans.push(curSpan);
    // 判断是否过长切行
    let residueSpan = 24 - (toalSpan % 24);
    toalSpan += curSpan > residueSpan ? curSpan + residueSpan : curSpan;
  }
});

const doCollapse = () => {
  isCollapse.value = !isCollapse.value;
  if (isCollapse.value) {
    let preSpan = 0;
    formList.value.forEach((inner: FormItem) => {
      if (preSpan + (inner.span || opts.span) > 16) {
        // BUG: 隐藏逻辑有问题，会覆盖自定义的方法，该处需要优化
        // BUG: 补充，该方法只用于query中，不涉及自定义的方法，暂不优化
        inner.show = () => false;
      } else {
        preSpan += inner.span || opts.span;
      }
    });
    searchSpan.value = preSpan >= 24 ? 24 : 24 - (preSpan % 24);
  } else {
    searchSpan.value = 24 - (toalSpan % 24);
    formList.value.forEach((inner: FormItem) => {
      inner.show = () => true;
    });
  }
};

if (opts.collapsible) {
  isCollapse.value = false;
  doCollapse();
} else {
  searchSpan.value = 24 - (toalSpan % 24);
}

/**
 * 检查当前表单的必填项是否全部填写完毕
 * 1. 过滤出当前mode下显示的字段
 * 2. show() 为 true 且 required() 为 true
 * 3. 若有 refRules，需逐条校验（如 required、pattern 等），否则只校验是否为空
 * 4. 全部满足返回 true，否则 false
 */
function validate() {
  // 过滤出当前显示的字段
  const visibleItems = formList.value.filter((item) => {
    return (
      (!item.show || item.show()) &&
      (!item.mode || !opts.mode || item.mode.includes(opts.mode))
    );
  });

  for (const item of visibleItems) {
    // 只校验必填项
    if (typeof item.required === "function" ? item.required() : item.required) {
      const value = form[item.prop];
      // refRules 校验
      if (
        item.refRules &&
        Array.isArray(item.refRules.value) &&
        item.refRules.value.length > 0
      ) {
        for (const rule of item.refRules.value) {
          // 只处理 required 校验
          if (rule.required) {
            if (
              value === undefined ||
              value === null ||
              (typeof value === "string" && value.trim() === "") ||
              (Array.isArray(value) && value.length === 0)
            ) {
              return false;
            }
          }
          // pattern 校验
          if (rule.pattern && value && !rule.pattern.test(value)) {
            return false;
          }
        }
      } else {
        // 没有 refRules，只判断是否为空
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

const enterSubmit = () => {
  emit("enter");
};

onMounted(() => {
  form.getRef = () => formRef.value;
  // 挂载方法
  form.validate = validate;
});

onUnmounted(() => {
  form.submit = undefined;
  form.getRef = undefined;
});
</script>
<style lang="scss" scoped>
.ju-item-inner {
  width: 100%;
  display: flex;
  align-items: center;
}
.query-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.collapsible {
  margin-left: 12px;
  cursor: pointer;
  color: var(--theme-color);
  .rotate {
    transform: rotate(180deg);
  }
}
.like-input {
  :deep(.el-input__wrapper) {
    padding: 0 12px !important;
    .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
