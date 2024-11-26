# Arbitrum Rewards Dashboard


This is the source for the arbitrum rewards dashboard site.

It is a vite+react app with tailwindcss, using lingui as a local cms

setup:
```
npm i
```

dev server:
```
npm run dev
```

generate lingui:
```
npm run lingui:extract
```

## VITE_WAC_URL_TEMPLATE configuration

Take in account the ENV variable `VITE_WAC_URL_TEMPLATE` is a template of the WAC URL, if you want any part of the URL to be custom, add the symbol `*` (for example: `https://xlabs-*.xyz`), and then use this function `getWACUrl(custom)`, where `custom` is the string that will replace `*`.
