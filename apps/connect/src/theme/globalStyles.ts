import { GlobalStyles } from "@mui/material";
import { ComponentProps } from "react";

export const globalStyles: ComponentProps<typeof GlobalStyles>["styles"] = (
  theme
) => ({
  ".MuiButton-containedPrimary p": {
    fontWeight: theme.typography.fontWeightBold,
  },
  ['[data-testid="CheckCircleOutlineIcon"]']: {
    color: "#7BFF3D",
  },
  ".MuiButton-containedPrimary": {},
  ".MuiIconButton-root": {},
  ".MuiPaper-root": {},
  '[class$="assetPickerContainer"] .MuiPaper-root': {},
  '[class$="amountCardContent"]': {},
  '[class$="assetPickerContainer"] .MuiCardContent-root': {},
});
