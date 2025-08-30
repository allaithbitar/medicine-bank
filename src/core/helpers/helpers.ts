import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ApiErrorResponse } from "../types/common.types";

export const isFetchBaseQueryError = (obj: any): obj is FetchBaseQueryError => {
  return !!obj["status"];
};

export const isApiError = (obj: any): obj is ApiErrorResponse => {
  return obj && "errorMessage" in obj;
};

export const getErrorMessage = (
  error:
    | FetchBaseQueryError
    | SerializedError
    | Error
    | ApiErrorResponse
    | string
    | object,
) => {
  if (!error) return "something_went_wrong";
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }

  if (isFetchBaseQueryError(error)) {
    error = error.data as Error;
  }

  if (isApiError(error)) {
    return error.errorMessage.ar;
  }
  return "something_went_wrong";
};

export const formatDateTime = (date: string | Date) =>
  Intl.DateTimeFormat("ar-SY", {
    timeStyle: "short",
    dateStyle: "long",
  }).format(typeof date === "string" ? new Date(date) : date);

export function isNullOrUndefined<T>(
  obj: T | undefined | null,
): obj is null | undefined {
  return obj === null || typeof obj === "undefined";
}
