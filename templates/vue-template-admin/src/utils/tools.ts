import dayjs from "dayjs";

export function toPromise<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    resolve(value);
  });
}

// 首字母大写
export function setUpperFirst(word: string): string {
  if (word.includes("/")) {
    const wordSplits = word.split("/");
    return wordSplits.map((w) => setUpperFirst(w)).join("");
  }
  return word[0].toUpperCase() + word.slice(1);
}

// 判断某个值是否为空值
export function verifyValueIsNull(val: any): boolean {
  const type = typeof val;
  if (["undefined"].includes(type)) {
    return !val;
  }
  if (type === "boolean") {
    return false;
  }
  if (Array.isArray(val)) {
    return val.length === 0;
  }
  if (type === "object") {
    return val === null ? true : Object.keys(val).length === 0;
  }
  if (type === "number" && Number.isNaN(val)) {
    return true;
  }
  return false;
}

// 深度克隆
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj; // 基本类型或 null 直接返回
  }

  if (obj instanceof Date) {
    return new Date(obj) as T; // 处理 Date
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj) as T; // 处理 RegExp
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T; // 处理数组
  }

  // 处理对象
  const cloneObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key]); // 递归克隆
    }
  }
  return cloneObj;
}

/**
 * 获取指定格式的当前时间
 * @param format 时间格式，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的当前时间字符串
 */
export function getCurrentTime(format: string = "YYYY-MM-DD HH:mm:ss"): string {
  return dayjs().format(format);
}
