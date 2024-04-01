import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocaleProvider } from "./LocaleProvider";
import { Web3Provider } from "./Web3Provider";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const AppProvider = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <>
      <LocaleProvider>
        <QueryClientProvider client={queryClient}>
          <Web3Provider>{children}</Web3Provider>
        </QueryClientProvider>
      </LocaleProvider>
    </>
  );
};
