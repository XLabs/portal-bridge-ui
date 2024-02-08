import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocaleProvider } from "./LocaleProvider";
import { Web3Provider } from "./Web3Provider";

const queryClient = new QueryClient();

export const AppProvider = (props: { children: JSX.Element }) => {
  return (
    <>
      <LocaleProvider>
        <QueryClientProvider client={queryClient}>
          <Web3Provider>{props.children}</Web3Provider>
        </QueryClientProvider>
      </LocaleProvider>
    </>
  );
};
