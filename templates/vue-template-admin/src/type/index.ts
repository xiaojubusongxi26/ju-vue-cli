import type { EntityOptions, TableColumn, TableRef } from "@/type/base";
import { verifyValueIsNull } from "@/utils/tools";

export class Base {
  static _events: any = {};
  _opts: EntityOptions = {};

  submit(call: (fn: () => void, bind: object) => void) {}

  getBinds(extraForBinds?: any, forAdvanced?: string[]): any {
    const defaultFilters = [
      "_opts",
      "get",
      "getRef",
      "clear",
      "emit",
      "submit",
      "set",
    ];
    const fileds = JSON.parse(JSON.stringify(this));
    delete fileds._opts;
    for (let key in this) {
      if (extraForBinds?.includes(key) || defaultFilters.includes(key)) {
        delete fileds[key];
      }
      if (verifyValueIsNull(fileds[key])) {
        delete fileds[key];
      }
    }
    return fileds;
  }

  emit(ev: string, ...val: any[]) {
    const evs = this._opts?.events as any;
    evs && evs[ev] && evs[ev](...val);
    if (Base._events[ev]) {
      Base._events[ev](...val);
    }
  }

  getRef(): any {}

  validate(): boolean {
    return true;
  }

  addEventListener(ev: string, call: any) {
    Base._events[ev] = call;
  }
}

export abstract class BaseTable<T> {
  abstract list: T[];
  abstract columns: TableColumn[];
  selection?: boolean;
  index?: boolean;
  id?: string;
  loading = false;
  sortColumn?: string;
  sortOrder?: "asc" | "desc";
  sortable?: boolean;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  virtual = false;
  virtualList: T[] = [];
  clearSort: () => void = () => {};

  constructor(id?: string, call?: (self: any) => void) {
    this.id = id;
    setTimeout(() => {
      call && call(this);
    }, 0);
  }

  getRef!: () => TableRef;
}
