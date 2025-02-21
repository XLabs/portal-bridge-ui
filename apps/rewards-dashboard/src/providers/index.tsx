import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocaleProvider } from "./LocaleProvider";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const AppProvider = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <>
      <LocaleProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </LocaleProvider>
    </>
  );
};
