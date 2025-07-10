// @ts-ignore
self.importScripts("/spark-md5.min.js");

self.onmessage = (e) => {
  // 生成文件hash
  const chuncks: Blob[] = e.data;
  // @ts-ignore
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0; // 当前转换进度
  let count = 0;
  const loadNext = (index: number) => {
    // 新建读取器
    const reader = new FileReader();
    // 设定读取数据格式
    reader.readAsArrayBuffer(chuncks[index]);
    // 监听读取完成
    reader.onload = (e) => {
      count++;
      // 读取结果并交给spark计算hash
      spark.append(e.target?.result as ArrayBuffer);
      // 若还有数据未读取，继续读取
      if (index < chuncks.length - 1) {
        percentage += 100 / chuncks.length;
        self.postMessage({
          percentage,
        });
        // 递归下一个切片
        loadNext(count);
      } else {
        // 所有数据读取完成，返回hash值和转换进度
        self.postMessage({ hash: spark.end(), percentage: 100 });
      }
    };
  };
  loadNext(0);
};
