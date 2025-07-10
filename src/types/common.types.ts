export interface IOptions {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}
