import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootStoreState } from '../store/root.store.types';
import { baseUrl } from '../api/root.api';
import { downloadAnyFile } from '../helpers/helpers';

type TUseFileDownloadOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT';
  filename: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

type TUseFileDownloadReturn = {
  download: (body?: Record<string, any>) => Promise<void>;
  progress: number;
  isDownloading: boolean;
  error: string | null;
  reset: () => void;
};

export const useFileDownload = (options: TUseFileDownloadOptions): TUseFileDownloadReturn => {
  const { url, method = 'GET', filename, onSuccess, onError } = options;

  const [progress, setProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootStoreState) => state.auth.token);

  const reset = useCallback(() => {
    setProgress(0);
    setIsDownloading(false);
    setError(null);
  }, []);

  const download = useCallback(
    async (body?: Record<string, any>): Promise<void> => {
      return new Promise((resolve, reject) => {
        setError(null);
        setProgress(0);
        setIsDownloading(true);

        const xhr = new XMLHttpRequest();

        const fullUrl = `${baseUrl}${url}`;

        xhr.open(method, fullUrl, true);

        xhr.responseType = 'blob';

        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        if ((method === 'POST' || method === 'PUT') && body) {
          xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const blob = xhr.response as Blob;

              const contentDisposition = xhr.getResponseHeader('Content-Disposition');
              let finalFilename = filename;

              if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                  finalFilename = filenameMatch[1].replace(/['"]/g, '');
                }
              }

              const file = new File([blob], finalFilename, { type: blob.type });
              downloadAnyFile(file);

              setProgress(100);
              setIsDownloading(false);

              if (onSuccess) {
                onSuccess();
              }

              resolve();
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Failed to process downloaded file';
              setError(errorMessage);
              setIsDownloading(false);

              if (onError) {
                onError(errorMessage);
              }

              reject(new Error(errorMessage));
            }
          } else {
            const errorMessage = `Download failed with status ${xhr.status}: ${xhr.statusText}`;
            setError(errorMessage);
            setIsDownloading(false);

            if (onError) {
              onError(errorMessage);
            }

            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => {
          const errorMessage = 'Network error occurred during download';
          setError(errorMessage);
          setIsDownloading(false);

          if (onError) {
            onError(errorMessage);
          }

          reject(new Error(errorMessage));
        };

        xhr.ontimeout = () => {
          const errorMessage = 'Download request timed out';
          setError(errorMessage);
          setIsDownloading(false);

          if (onError) {
            onError(errorMessage);
          }

          reject(new Error(errorMessage));
        };

        xhr.onabort = () => {
          const errorMessage = 'Download was cancelled';
          setError(errorMessage);
          setIsDownloading(false);

          if (onError) {
            onError(errorMessage);
          }

          reject(new Error(errorMessage));
        };

        xhr.timeout = 120000;

        if ((method === 'POST' || method === 'PUT') && body) {
          xhr.send(JSON.stringify(body));
        } else {
          xhr.send();
        }
      });
    },
    [url, method, filename, token, onSuccess, onError]
  );

  return {
    download,
    progress,
    isDownloading,
    error,
    reset,
  };
};

export default useFileDownload;
