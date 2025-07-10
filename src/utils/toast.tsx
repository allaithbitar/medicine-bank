import hotToast, { type ToastOptions } from "react-hot-toast";
import CustomToast from "./CustomToast";

type CustomToastOptions = ToastOptions;

const defaultSuccessOptions: ToastOptions = {
  duration: 3000,
  style: {
    background: "#28a745",
    color: "#fff",
  },
  iconTheme: {
    primary: "#fff",
    secondary: "#28a745",
  },
};

const defaultErrorOptions: ToastOptions = {
  duration: 4000,
  style: {
    background: "#dc3545",
    color: "#fff",
  },
  iconTheme: {
    primary: "#fff",
    secondary: "#dc3545",
  },
};

const defaultLoadingOptions: ToastOptions = {
  duration: Infinity,
  style: {
    background: "#007bff",
    color: "#fff",
  },
};

const defaultInfoOptions: ToastOptions = {
  duration: 3500,
  style: {
    background: "#ffc107",
    color: "#333",
  },
};

const defaultDefaultOptions: ToastOptions = {
  duration: 3000,
  style: {
    background: "#343a40",
    color: "#fff",
  },
};

/**
 * Displays a success toast notification.
 * @param message The message to display.
 * @param options Optional: Additional react-hot-toast options to merge.
 * @returns The ID of the displayed toast.
 */
export const showSuccess = (message?: string, options?: CustomToastOptions) => {
  const mergedOptions = { ...defaultSuccessOptions, ...options };
  return hotToast.custom(
    (t) => (
      <CustomToast
        t={t}
        message={message || "Action Done Successfully"}
        type="success"
      />
    ),
    mergedOptions
  );
};

/**
 * Displays an error toast notification.
 * @param message The message to display.
 * @param options Optional: Additional react-hot-toast options to merge.
 * @returns The ID of the displayed toast.
 */
export const showError = (
  message: string,
  options?: CustomToastOptions
): string => {
  const mergedOptions = { ...defaultErrorOptions, ...options };
  return hotToast.custom(
    (t) => <CustomToast t={t} message={message} type="error" />,
    mergedOptions
  );
};

/**
 * Displays an information toast notification.
 * @param message The message to display.
 * @param options Optional: Additional react-hot-toast options to merge.
 * @returns The ID of the displayed toast.
 */
export const showInfo = (
  message: string,
  options?: CustomToastOptions
): string => {
  const mergedOptions = { ...defaultInfoOptions, ...options };
  return hotToast.custom(
    (t) => <CustomToast t={t} message={message} type="info" />,
    mergedOptions
  );
};

/**
 * Displays a loading toast notification.
 * @param message The message to display.
 * @param options Optional: Additional react-hot-toast options to merge.
 * @returns The ID of the displayed toast.
 */
export const showLoading = (
  message: string,
  options?: CustomToastOptions
): string => {
  const mergedOptions = { ...defaultLoadingOptions, ...options };
  return hotToast.custom(
    (t) => <CustomToast t={t} message={message} type="loading" />,
    mergedOptions
  );
};

/**
 * Displays a general/default toast notification.
 * @param message The message to display.
 * @param options Optional: Additional react-hot-toast options to merge.
 * @returns The ID of the displayed toast.
 */
export const showDefault = (
  message: string,
  options?: CustomToastOptions
): string => {
  const mergedOptions = { ...defaultDefaultOptions, ...options };
  return hotToast.custom(
    (t) => <CustomToast t={t} message={message} type="default" />,
    mergedOptions
  );
};

export const dismissToast = hotToast.dismiss;
export const removeAllToasts = hotToast.remove;
export const promiseToast = hotToast.promise;
