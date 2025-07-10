import type { ElTable, FormItemRule } from "element-plus";

/* 
  form表单配置项
  @prop 表单英文名
  @label 表单中文名
  @type 表单项组件类型
  @show 表单项是否显示
  @required 表单项是否必填
  @disabled 表单项是否禁用
  @rules 表单项校验规则参考element-plus
*/
export interface FormItem {
  prop?: string;
  label: string;
  type:
    | "input"
    | "select"
    | "radio"
    | "checkbox"
    | "textarea"
    | "input-number"
    | "date"
    | "date-range"
    | "switch"
    | "tree-select"
    | "dict-select"
    | "url-select"
    | "tree-select"
    | "upload"
    | "date-picker";
  span?: number;
  labelWidth?: number;
  show?: () => boolean;
  key?: () => string;
  disabled?: () => boolean;
  required?: () => boolean;
  rules?: FormItemRule[];
  refRules?: any;
  mode?: string | string[];
  element?: any;
  events?: any;
  list?: any;
  config?: any;
  query?: QueryFeild;
  search?: QueryFeild;
  reflect?: string;
}

/*
 * form表单配置项数据
 * */
export interface FormItemOption extends FormItem {
  prop: string;
}

/**
 * form 的表单项的输入规范
 * @prop 表单项key
 * @show 表单项是否显示
 * @disabled 表单项是否禁用
 * @required 表单项是否必传
 * @rules 表单项校验规则参照element-plus
 */
export interface Feild extends FormItem {
  span?: number;
  labelWidth?: number;
  key?: () => string;
  show?: () => boolean;
  disabled?: () => boolean;
  required?: () => boolean;
  rules?: FormItemRule[];
  refRules?: any;
  list?: any;
}

export interface QueryFeild extends Feild {
  label: string;
  type:
    | "input"
    | "select"
    | "radio"
    | "checkbox"
    | "textarea"
    | "input-number"
    | "date"
    | "date-range"
    | "switch"
    | "tree-select"
    | "dict-select"
    | "url-select"
    | "tree-select"
    | "upload"
    | "date-picker";
}

/**
 * 表格列通用配置
 * mode 模式匹配
 * span 全局span
 * collapsible 是否可展开收起
 * placeholder 是否显示placeholder
 * labelWidth 全局labelWidth
 * events 注册事件
 */
export interface EntityOptions {
  name?: string;
  mode?: string | string[];
  span?: number;
  collapsible?: boolean;
  queryVisible?: boolean;
  placeholder?: boolean;
  labelWidth?: number;
  forceAlignLeft?: boolean; //only for XklFormInfo
  events?: any;
  element?: FormElement;
}

export interface FormElement {
  labelPosition?: "left" | "right" | "top";
  hideRequiredAsterisk?: boolean;
  requireAsteriskPosition?: "left" | "right";
  showMessage?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  size?: "" | "large" | "default" | "small";
  disabled?: boolean;
  scrollToError?: boolean;
}

export interface TableColumnElement {
  showOverflowTooltip?: boolean;
  resizable?: boolean;
  className?: string;
  labelClassName?: string;
  minWidth?: number;
  type?: "selection" | "index" | "expand";
  fixed?: "left" | "right" | boolean;
}

/**
 * 表格列通用配置
 * prop 列绑定字段
 * label 列标题
 * width 列宽度
 * sortable 列排序
 * slot 是否启用插槽
 */
export interface TableColumn {
  id?: string | number;
  key?: string | number;
  prop: string;
  label: string;
  dict?: string;
  width?: number | string;
  sortable?: boolean | string;
  slot?: boolean;
  headerSlot?: boolean;
  edit?: boolean;
  reflect?: string;
  editType?: "input" | "radio" | "checkbox" | "select" | "textarea" | "date";
  align?: "left" | "center" | "right";
  tags?: { color: string } | { color: string; value: string | number }[];
  format?: string;
  element?: TableColumnElement;
  extra?: { [prop: string]: string | number | boolean };
  sortOrder?: number;
}

export interface LocalMenu {
  label: string;
  value: string;
  disabled?: boolean;
  children?: LocalMenu[];
}

export interface SideMenu {
  id?: string;
  path: string;
  name: string;
  title: string;
  component: string;
  type?: "folder" | "file";
  icon?: string;
  fullPath?: string;
  fullName?: string;
  meta?: {
    title?: string;
    keepAlive?: boolean;
  };
  children?: SideMenu[];
}

export interface SelectItem {
  id?: string | number;
  label: string;
  value: string | number | string[] | number[] | boolean | boolean[];
  disabled?: any;
}

export interface Attachment {
  id?: string;
  name: string;
  url: string;
}

export interface BaseElement {
  clearable?: boolean;
  placeholder?: string;
  readonly?: boolean;
  size?: "small" | "large";
}

export interface InputElement extends BaseElement {
  maxlength?: number;
  minlength?: number;
  type?: "password";
  change?: () => void;
}

export interface InputNumberElement extends BaseElement {
  min?: number;
  max?: number;
  step?: number;
  stepStrictly?: boolean;
  precision?: number;
  controls?: boolean;
  controlsPosition?: "" | "right";
}

export interface TextareaElement extends InputElement {
  rows?: number;
  autosize?: boolean | { minRows?: number; maxRows?: number };
}

export interface SelectElement extends BaseElement {
  multiple?: boolean;
  collapseTags?: boolean;
  filterable?: boolean;
  allowCreate?: boolean;
  remote?: boolean;
  filterMethod?: () => void;
  remoteMethod?: () => void;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
}

export interface TreeSelectElement {
  showCheckbox?: boolean;
  multiple?: boolean;
  collapseTags?: boolean;
  checkStrictly?: boolean;
  filterable?: boolean;
}

export interface DatePickerElement extends BaseElement {
  type:
    | "year"
    | "month"
    | "date"
    | "dates"
    | "datetime"
    | "week"
    | "datetimerange"
    | "daterange"
    | "monthrange";
  format?: string;
  valueFormat?: string;
  rangeSeparator?: string;
  func?: "bottomshortcut";
}

export type TableRef = InstanceType<typeof ElTable>;

export interface XklConfig {
  base: {
    dict_api_url: string;
    auth_api?: string;
    auth_token_key?: string;
    successCodes: (string | number)[];
    warningCodes: (string | number)[];
    failedCodes: (string | number)[];
  };
  components: {
    button?: {};
    form?: {
      element?: FormElement;
    };
    formInfo?: {};
    dict?: {
      filterable?: boolean;
    };
    select?: {
      filterable?: boolean;
    };
    treeSelect?: {};
    table?: {
      headerCellStyle?: {};
      element?: {
        height?: number | string;
        maxHeight?: number | string;
        tooltipOptions?: {
          placement?:
            | "top"
            | "top-start"
            | "top-end"
            | "bottom"
            | "bottom-start"
            | "bottom-end"
            | "left"
            | "left-start"
            | "left-end"
            | "right"
            | "right-start"
            | "right-end";
          popperClass?: string;
          effect?: "dark" | "light";
          appendTo?: string;
        };
      };
      defaultAlignment?: "left" | "right" | "center";
    };
    upload?: {};
    datePicker?: {};
  };
  panel: {};
}
