const MM_ERR_WITH_INFO_START =
  "VM Exception while processing transaction: revert ";
const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

const parseError = (e: any): string => {
  if (e?.data?.message?.startsWith(MM_ERR_WITH_INFO_START)) {
    return e.data.message.replace(MM_ERR_WITH_INFO_START, "");
  }

  if (e?.response?.data?.error) {
    // mostly Terra errors
    return e.response.data.error;
  }

  if (e?.message) {
    return e.message;
  }

  return DEFAULT_ERROR_MESSAGE;
};

export default parseError;
