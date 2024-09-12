import { GlobalStyles } from "@mui/material";
import { ComponentProps } from "react";

export const globalStyles: ComponentProps<typeof GlobalStyles>["styles"] = (
  theme
) => ({
  ".MuiButton-containedPrimary": {
    backgroundColor: "#7ABFFF!important",
    borderRadius: "27px!important",
    paddingTop: "12px!important",
    paddingBottom: "12px!important",
  },
  ".MuiButton-containedPrimary p": {
    fontWeight: theme.typography.fontWeightBold,
  },
  ".MuiIconButton-root": {
    color: "#999999!important",
  },
  ".MuiPaper-root": {
    borderRadius: "16px!important",
  },
  '[class$="assetPickerContainer"] .MuiPaper-root': {
    backgroundColor: "#1F1F1F!important",
  },
  '[class$="assetPickerContainer"] .MuiCardContent-root': {
    backgroundColor: "none!important",
  },
  '[class$="amountCardContent"]': {
    padding: "16px!important",
  },
  ['[data-testid="CheckCircleOutlineIcon"]']: {
    color: "#7BFF3D",
  },
});
