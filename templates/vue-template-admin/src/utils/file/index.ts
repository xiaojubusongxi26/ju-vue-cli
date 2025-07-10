/*
 * 大文件上传工具函数
 * */

import type { UploadFile } from "element-plus";

/*
 * @params: 文件切片
 * file: element上传之后的文件数据
 * chuckSize: 切片大小，默认为5MB
 * */
export const createFileChunks = (
  file: UploadFile,
  chuckSize: number = 5 * 1024 * 1024
) => {
  const chuncks: Blob[] = [];
  for (let i = 0; i < (file.size as number); i += chuckSize) {
    chuncks.push((file.raw as File).slice(i, i + chuckSize));
  }
  return chuncks;
};

/*
 * @params: 获取文件hash值
 * chuncks: 切片后的文件数组
 * */
export const calculateFileHash = async (chuncks: Blob[]): Promise<string> => {
  return new Promise((resolve) => {
    // 根据文件切片的内容生成唯一的hash值，为了防止大量占用主线程运行时间，使用Worker线程计算hash值
    const worker = new Worker("/src/utils/file/hash.ts");
    worker.postMessage(chuncks); // 向worker线程发送数据切片
    // 接收worker线程的数据
    worker.onmessage = (e) => {
      const { percentage, hash } = e.data;
      if (hash) {
        resolve(hash);
        console.log("终止worker");
        // worker.terminate();
      }
    };
  });
};
