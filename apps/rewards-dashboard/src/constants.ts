export const WAC_URL_TEMPLATE = import.meta.env.VITE_WAC_URL_TEMPLATE
  ? import.meta.env.VITE_WAC_URL_TEMPLATE
  : "https://allez-xyz--usds-*.modal.run";

  export const getWACUrl = (custom: string) => {
    return WAC_URL_TEMPLATE.replace("*", custom);
  }

  export const WAC_URL = import.meta.env.VITE_WAC_URL
  ? import.meta.env.VITE_WAC_URL
  : "https://wac.gfx.xyz";
