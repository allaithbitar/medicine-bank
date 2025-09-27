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
    | object
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

export const formatDateTime = (date: string | Date, withTime = true) =>
  Intl.DateTimeFormat("ar-SY", {
    dateStyle: "full",
    ...(withTime && {
      timeStyle: "short",
    }),
  }).format(typeof date === "string" ? new Date(date) : date);

export function isNullOrUndefined<T>(
  obj: T | undefined | null
): obj is null | undefined {
  return obj === null || typeof obj === "undefined";
}

export const formatDateToISO = (d?: Date | null) => {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
