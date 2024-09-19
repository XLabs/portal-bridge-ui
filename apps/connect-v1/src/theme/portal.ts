import createTheme from "@mui/material/styles/createTheme";
import responsiveFontSizes from "@mui/material/styles/responsiveFontSizes";
import font from "../assets/fonts/SuisseBPIntlBold.woff2";

const suisse = {
  fontFamily: "Suisse BP Intl",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `url(${font}) format('woff2')`,
};

export const FONT_SIZE = {
  XS: 12,
  S: 14,
  M: 16,
  L: 18,
  XL: 20,
  XXL: 24,
} as const;

export const COLOR = {
  blue: "#1975e6",
  blueWithTransparency: "rgba(25, 117, 230, 0.8)",
  gray: "#4e4e54",
  green: "#0ac2af",
  greenWithTransparency: "rgba(10, 194, 175, 0.8)",
  lightGreen: "rgba(51, 242, 223, 1)",
  lightBlue: "#83b9fc",
  nearBlack: "#070528",
  nearBlackWithMinorTransparency: "rgba(0,0,0,.25)",
  red: "#aa0818",
  darkRed: "#810612",
  white: "#ffffff",
  whiteWithTransparency: "#ffffffb3",
  black: "#000000",
  mainBackground: "#070528",
};

export const themePortal = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      background: {
        default: COLOR.mainBackground,
        paper: COLOR.mainBackground,
      },
      divider: COLOR.white,
      text: { primary: COLOR.white },
      primary: { main: COLOR.blueWithTransparency, light: COLOR.lightBlue },
      secondary: { main: COLOR.greenWithTransparency, light: COLOR.lightGreen },
      error: { main: COLOR.red },
    },

    typography: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: FONT_SIZE.XS,
      h1: {
        fontFamily: "Suisse BP Intl, sans-serif",
        lineHeight: 0.9,
        letterSpacing: -2,
        fontWeight: "bold",
      },
      h2: { fontWeight: "200" },
      h4: {
        fontWeight: "600",
        fontFamily: "Suisse BP Intl, sans-serif",
        letterSpacing: -1.02,
      },
    },
    zIndex: { modal: 50 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "@font-face": [suisse],
          body: {
            overscrollBehaviorY: "none",
            backgroundPosition: "top center",
            backgroundRepeat: "repeat-y",
            backgroundSize: "120%",
          },
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor: `${COLOR.gray} ${COLOR.nearBlackWithMinorTransparency}`,
          },
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            backgroundColor: COLOR.nearBlackWithMinorTransparency,
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: COLOR.gray,
            borderRadius: "4px",
          },
          "*::-webkit-scrollbar-corner": {
            /** this hides an annoying white box which appears when both scrollbars are present */ backgroundColor:
              "transparent",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: COLOR.whiteWithTransparency,
            "&:before": { display: "none" },
          },
          rounded: {
            "&:first-child": {
              borderTopLeftRadius: "28px",
              borderTopRightRadius: "28px",
            },
            "&:last-child": {
              borderBottomLeftRadius: "28px",
              borderBottomRightRadius: "28px",
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: { root: { borderRadius: "8px", border: "1px solid" } },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "22px", letterSpacing: ".1em" },
          outlinedSizeSmall: { padding: "6px 9px", fontSize: "0.70rem" },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: { textDecoration: "none", color: COLOR.lightBlue },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: "28px", backdropFilter: "blur(4px)" },
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: { backgroundColor: "transparent", padding: 0 },
        },
      },
      MuiStep: {
        styleOverrides: {
          root: {
            backgroundColor: COLOR.whiteWithTransparency,
            backdropFilter: "blur(4px)",
            borderRadius: "28px",
            padding: "32px 32px 16px",
          },
        },
      },
      MuiStepConnector: {
        styleOverrides: { lineVertical: { borderLeftWidth: 0 } },
      },
      MuiStepContent: {
        styleOverrides: {
          root: { borderLeftWidth: 0, marginLeft: 0, paddingLeft: 0 },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            color: COLOR.white,
            textTransform: "uppercase",
            "&.MuiStepLabel-active": {},
            "&.MuiStepLabel-completed": {},
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${COLOR.white}` },
          indicator: {
            height: "100%",
            background: "linear-gradient(20deg, #f44b1b 0%, #eeb430 100%);",
            zIndex: -1,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: COLOR.white,
            fontFamily: "Suisse BP Intl, sans-serif",
            fontWeight: "bold",
            fontSize: FONT_SIZE.L,
            padding: 12,
            letterSpacing: "-0.69px",
            textTransform: "none",
          },
          textColorInherit: { opacity: 1 },
        },
      },
      MuiTableCell: { styleOverrides: { root: { borderBottom: "none" } } },
      MuiCircularProgress: {
        styleOverrides: { root: { color: COLOR.lightBlue } },
      },
    },
  })
);
