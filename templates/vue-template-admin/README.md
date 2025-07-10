# Ju-Admin后台管理系统模板

项目用于快速搭建后台管理页面，简化开发步骤。



## 项目目录划分

- assets：静态资源
- components
  - **common**：通用组件
  - **lauout**：布局组件
- directives：自定义指令
- **entity**：实例类组件
- hooks：组合式组件
  - `useApp.ts`：系统基础数据
  - `useSelfRouter.ts`：处理路由数据
- icons：讲`svg`文件图片转换成组件使用
- module：ts类型
- router：路由
- **servie**：存放页面的接口调用
- styles：样式
- **type**：通用组件的类型定义
- utils：工具类
- **views**：页面文件
  - **module**：存放业务页面文件



## 组件介绍

通用类组件：

- JuCheckbox
- JuDatePicker
- **JuForm**：整合了其他表单类组件，根据**实体类**完成表单的渲染
- JuSelect
- **JuTable**：根据实体类进行表格渲染
- JuTreeSelect
- JuUpload
- JuUploadBig：大文件上传
- PaddingBox
- PageContainer
- **TableConfig**：表格工具类，包含功能：字段排序、刷新表格





## entity层

该层主要存放页面中使用的表单、表格的实体类，然后使用`ju-form.vue`、`ju-table.vue`组件进行渲染页面

### form类

示例ts：

```ts
import { Base, BaseTable } from "@/type";
import type { EntityOptions, TableColumn } from "@/type/base";
import * as c from "@/type/component";

export class Example extends Base {
  // 定义字段名以及初始数据
  input = "";
  selectConfig = "";
  selectList = "";
  dateSelect = "";
  treeSelect = "";
  radio = "";
  checkBox = "";
  inputNumber = null;
  selfComponent = "";
  
  // 构造器
  constructor(opts?: EntityOptions) {
    super();
    opts && (this._opts = opts);
  }

  // 设置Form值
  setForm(form: Origin) {
    Object.assign(this, form);
  }

  // 清空form（重新创建新的Form类）
  clear() {
    const ref = this.getRef();
    ref.resetFields();
    this.setForm(new Example(this._opts));
  }

 /* 
 	* 以下定义的方法用于表单组件渲染对应的输入控件
 	* 命名方式固定为：get+字段名（大驼峰）
 	*/
  
  // 普通输入框
  getInput(): c.Input {
    return {
      type: "input",
      label: "输入框",
      mode: ["query"],	// 创建表单时需要指定Form的mode，只有当字段mode中包含创建表单指定的mode，才会在对应表单显示该字段
    };
  }
  
  // 选择器
  // 选择器的数据可以通过list属性传入，也可以通过config配置接口，或者特定的dict指定字典类型
  // 1. config
  getSelectConfig(): c.Select {
    return {
      type: "select",
      label: "选择器-config",
      config: {
        url: "/dict/getDictData",
        params: {
          key: "dict_mp",
        },
      },
      mode: ["query"],
      element: {
        multiple: true,
      },
      events: {
        itemChange: (val: any, current: any, list: any) => {
          console.log("选择器", val, current, list);
        },
      },
    };
  }
  // 2. list
  getSelectList(): c.Select {
    return {
      type: "select",
      label: "选择器-list",
      list: [
        { value: "4", label: "参一祖师" },
        { value: "3", label: "生死山河主" },
        { value: "2", label: "软饭居士" },
        { value: "1", label: "无道极法魔君" },
        { value: "0", label: "常世万法仙君" },
      ],
      mode: ["query"],
      config: {
        all: true,
      },
      element: {
        collapseTags: true,
        multiple: true,
      },
      events: {
        change: (val: any, list: any) => {
          console.log("选择器", val, list);
        },
      },
    };
  }

  
	// 	日期选择器
  getDateSelect(): c.DatePicker {
    return {
      type: "date-picker",
      label: "日期选择器",
      mode: ["query"],
      element: {
        type: "datetimerange",
      },
      events: {
        change: (val: any, list: any) => {
          console.log("时间选择", val, list);
        },
      },
    };
  }

  // 树形选择器，数据配置同选择器
  getTreeSelect(): c.TreeSelect {
    return {
      type: "tree-select",
      label: "树形选择器",
      mode: ["query"],
      config: {
        url: "",
      },
      element: {
        checkStrictly: true,
        multiple: true,
        filterable: true,
      },
      events: {
        change: (val: any, list: any) => {
          console.log("树形选择器", val, list);
        },
      },
    };
  }

  // 单选器，数据配置同选择器
  getRadio(): c.Radio {
    return {
      type: "radio",
      label: "单选器",
      list: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      mode: ["query"],
      events: {},
    };
  }

  // 复选框，数据配置同选择器
  getCheckbox(): c.Checkbox {
    return {
      type: "checkbox",
      label: "复选框",
      config: {
        key: "dict_mp",
      },
      mode: ["query"],
      events: {
        change: (val: any, list: any) => {
          console.log("复选框：", val, list);
        },
      },
    };
  }

  // 数字输入框
  getInputNumber(): c.InputNumber {
    return {
      type: "input-number",
      label: "数字输入框",
      mode: ["query"],
      element: {
        controls: false,
      },
    };
  }
  
  // 不使用通用组件的情况
  getSelfComponent() {
    return {
      label: "自定义内容，在ju-form组件中使用插槽插入指定位置",
      mode: ['query']
    }
  }
}
```



字段方法的定义，要求如下：

1. 命名必须为`get+字段名（首字母必须大写，其余和字段本身保持一致）`

2. 如果使用通用组件，需要引入封装的统一组件类型，并给方法指定对应类型的返回值。不使用通用组件（需要在页面中插槽定义）,则不需要指定

   ```ts
   import * as c from "@/type/component";	// 组件类型定义
   
   // 使用通用组件
   getXxxx(): c.Input{
     return {}
   }
   
   // 不使用通用组件（需要在页面中插槽定义）
   getXxxx() {
     return {}
   }
   ```

3. 方法返回的对象包含字段如下：

```ts
getXxxx(): c.Input{
  return {
    type: 'input',	// 使用通用组件需要指定type，与使用组件类型一致,如果不使用通用组件，不需要这个字段
    mode: "" || [], // 必须，字段匹配表单的标识，只渲染mode包含的表单中,多个使用string[]指定
    label: "", 
    
  }
}
```



### table类

示例：

```ts
export class ExampleTable extends BaseTable<Origin> {
  // 索引配置
  index = true;
  indexConfig = {
    width: 100,
    label: "序号"
  }
  // 选择配置
  selection = true;
  selectionConfig = {
    fiexd: "left",
    reserveSelection: true,
  };
  
  // 操作配置
  operation = {
    label: "操作",
    fixed: "right",
    width: 150,
  };

  // 列配置
  columns: TableColumn[] = [
    {
      prop: "name",
      label: "姓名",
      width: 300,
      element: {
        showOverflowTooltip: true,
      },
    },
  ];

  // 选择的数据
  selecedData: Example[] = [];
  // 列表数据
  list: Example[] = [];
}

```





## service层

通过封装的`Get`、`Post`、`Put`等方法，实现一个服务类并导出使用

```ts
import { Get, Post } from "@/utils/request";

class TodoServer {
  async getList(params: any) {
    return await Post("/todo/list", params);
  }
  async add(params: any) {
    return await Post("/todo/add", params);
  }
  async delete(params: any) {
    return await Get("/todo/delete", params);
  }
}

export default new TodoServer();

```





## view层

### 页面基本结构

- 表单
- 表格
  - 表格工具
  - 表格列表
- 分页器



## 常见功能实现

- 按钮防抖
- 大文件上传
- 表格排序
- 表格记忆功能
- 动态路由







