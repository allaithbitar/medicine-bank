import { Outlet } from "react-router-dom";
import ThemeContextProvider from "@/core/context/theme.context";
import ModalProvider from "../../common/modal/modal-provider.component";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppUiWrapper = () => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1 } } }),
  );
  return (
    <>
      <ThemeContextProvider>
        <ModalProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </ModalProvider>
      </ThemeContextProvider>
    </>
  );
};

export default AppUiWrapper;
