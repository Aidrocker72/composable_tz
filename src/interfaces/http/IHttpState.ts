export interface IHttpState<T = any> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  loaded: boolean;
  status: number | null;
};
