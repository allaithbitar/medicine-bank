import { Outlet } from 'react-router-dom';
import ThemeContextProvider from '@/core/context/theme.context';
import ModalProvider from '../../common/modal/modal-provider.component';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRuntimeTypeContextProvider } from '@/core/context/app-runtime-type.context';

const AppUiWrapper = () => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 0, networkMode: 'offlineFirst' } } })
  );

  return (
    <AppRuntimeTypeContextProvider>
      <ThemeContextProvider>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <Outlet />
            <Toaster
              toastOptions={{
                duration: 3000,
                position: 'bottom-center',
              }}
            />
          </ModalProvider>
        </QueryClientProvider>
      </ThemeContextProvider>
    </AppRuntimeTypeContextProvider>
  );
};

export default AppUiWrapper;
