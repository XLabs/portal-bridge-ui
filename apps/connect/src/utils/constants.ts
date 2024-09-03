export const PrivacyPolicyPath = "/privacy-policy";
export const ConnectV2Path = "/beta-v2";

export const isPreview =
  window.location.origin.includes("preview") ||
  window.location.origin.includes("testnet");

export const isProduction = window.location.host === "portalbridge.com";
