const MM_ERR_WITH_INFO_START =
  "VM Exception while processing transaction: revert ";
const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

interface ErrorParser {
  apply?: (e: any) => boolean;
  value: (e: any) => string;
}

const isString = (e: any) => e instanceof String;

const DefaultParser: ErrorParser = {
  value: (e: any) => {
    console.trace(e);
    return DEFAULT_ERROR_MESSAGE;
  },
};

const Parsers: ErrorParser[] = [
  {
    apply: (e: any) =>
      isString(e?.data?.message) &&
      e?.data?.message?.startsWith(MM_ERR_WITH_INFO_START),
    value: (e: any) => e.data.message.replace(MM_ERR_WITH_INFO_START, ""),
  },
  {
    apply: (e: any) => isString(e?.response?.data?.error),
    value: (e: any) => e.response.data.error,
  },
  {
    apply: (e: any) => isString(e?.message),
    value: (e: any) => e.message,
  },
];

const parseError = (e: any): string =>
  (Parsers.find(({ apply = () => true }) => apply(e)) || DefaultParser).value(
    e
  );

export default parseError;
