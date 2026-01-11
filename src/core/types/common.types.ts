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

export type TPayload = {
  pageNumber?: number;
  pageSize?: number;
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

export type TActioner = { id: string; name: string };

export type TCreatedBy = { createdBy: TActioner | null };

export type TUpdatedBy = { updatedBy: TActioner | null };

export type TAutocompleteItem = Record<string, string> & {
  id: string;
  name: string;
};
