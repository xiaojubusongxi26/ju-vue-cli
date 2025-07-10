export interface menuModel {
  name: string;
  path: string;
  fullPath: string;
  icon: string;
  frontPath: string;
  authId: string;
  frontName: string;
  parentId: string;
  orderNum: number;
  menuType: string;
  component?: any;
  meta?: any;
  children: menuModel[] | undefined;
}
export interface tableConfigModel {
  tableId: string;
  visibleColumn: string;
  tableColumn: string;
}
export interface listResponse {
  currentPage: number;
  pageSize: number;
  total: number;
  list: any[];
}
