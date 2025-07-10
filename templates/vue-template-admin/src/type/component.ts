import type { DefineComponent, ShallowRef } from "vue";
import type {
  Feild,
  SelectItem,
  InputElement,
  InputNumberElement,
  TextareaElement,
  SelectElement,
  TreeSelectElement,
  DatePickerElement,
} from "./base";

export interface Input extends Feild {
  type: "input";
  element?: InputElement;
}

export interface InputNumber extends Feild {
  type: "input-number";
  element?: InputNumberElement;
}

export interface Textarea extends Feild {
  type: "textarea";
  element?: TextareaElement;
}

export interface Select extends Feild {
  type: "select";
  list?: SelectItem[] | (() => SelectItem[]);
  element?: SelectElement;
}

export interface UrlSelect extends Feild {
  type: "url-select";
  config: {
    url: string;
    labelTarget: string;
    valueTarget: string;
    params?: any;
    split?: string;
    filterKeys?: string[];
    customOption?: ShallowRef<DefineComponent>;
    all?: boolean;
  };
  element?: SelectElement;
}

export interface DictSelect extends Feild {
  type: "dict-select";
  config: {
    key: string;
  };
}

export interface TreeSelect extends Feild {
  type: "tree-select";
  config: {
    url: string;
    labelTarget?: string;
    valueTarget?: string;
    toTree?: {
      id: string;
      pId: string;
      incorporate?: string;
    };
  };
  element?: TreeSelectElement;
}

export interface Radio extends Feild {
  type: "radio";
  list: SelectItem[];
}

export interface Checkbox extends Feild {
  type: "checkbox";
  list?: SelectItem[];
}

export interface DatePicker extends Feild {
  type: "date-picker";
  element: DatePickerElement;
}

export interface Upload extends Feild {
  type: "upload";
  config: {
    url?: string;
    maxSize?: number;
    authorization?: string;
    accept?: string;
    acceptTip?: string;
    headers?: any;
    params?: () => any;
  };
}
