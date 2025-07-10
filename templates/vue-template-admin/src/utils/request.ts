import http from "./http";

export interface CommonResponse<T = any> {
  code: number;
  data: T | any;
  message: string;
  error?: string;
  success?: boolean;
}

export async function Get(
  url: string,
  params?: any,
  config?: any
): Promise<CommonResponse> {
  return await http({
    url: url,
    method: "get",
    params: params,
    ...config,
  });
}

export async function Post(
  url: string,
  params?: any,
  config?: any
): Promise<CommonResponse> {
  return await http({
    url: url,
    method: "post",
    data: params,
    ...config,
  });
}

export async function FilePost(
  url: string,
  params?: any,
  _header?: any
): Promise<CommonResponse> {
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: "jujuju",
    ..._header,
  };
  return await http({
    url: url,
    method: "post",
    data: params,
    headers,
  });
}
