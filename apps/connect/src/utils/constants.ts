export const PrivacyPolicyPath = "/privacy-policy";
export const ConnectV1Path = "/v1";

export const isPreview =
  window.location.origin.includes("preview") ||
  window.location.origin.includes("testnet");

export const isProduction = window.location.host === "portalbridge.com";
