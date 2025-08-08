export type TErrorMessage = {
  en: string;
  ar: string;
  code: string;
  details: any;
};

export interface ApiResponse<T> {
  data: T;
  errorMessage: null;
}

export type TPaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export interface ApiErrorResponse {
  data: null;
  errorMessage: TErrorMessage;
}

export interface IOptions {
  id: string;
  name: string;
}

export type TPaginationDto = {
  pageSize?: number;
  pageNumber?: number;
};
