export interface IHttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
};
