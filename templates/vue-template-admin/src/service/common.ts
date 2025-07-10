import type { tableConfigModel } from "@/module";
import { Get, Post, type CommonResponse } from "@/utils/request";

/* 
  请求数据字典
*/
export async function fetchDataDic(params: any): Promise<CommonResponse> {
  return await Get("/dict/getDictData", params);
}

/*
 * @params: 查询表格配置项
 * tableId: string
 * */
export async function getTableConfig(tableId: string) {
  return await Get("/common/getTableConfig", { tableId });
}
/*
 * @params: 修改表格配置项
 * tableId: string,
 * visibleColumn: string
 * tableColumn: string
 * */
export async function setTableConfig(params: tableConfigModel) {
  return await Post("/common/setTableConfig", params);
}
