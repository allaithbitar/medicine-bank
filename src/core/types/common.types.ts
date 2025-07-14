export interface ApiResponse<T> {
  items: T;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
export interface IOptions {
  id: string;
  name: string;
}
