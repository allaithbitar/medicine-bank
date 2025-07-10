export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}
export interface IOptions {
  id: string;
  name: string;
}
