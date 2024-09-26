import { GlobalStyles } from "@mui/material";
import { ComponentProps } from "react";

export const globalStyles: ComponentProps<
  typeof GlobalStyles
>["styles"] = () => ({
  ".MuiButton-containedPrimary p": {},
  ['[data-testid="CheckCircleOutlineIcon"]']: {},
  ".MuiButton-containedPrimary": {},
  ".MuiIconButton-root": {},
  ".MuiPaper-root": {},
  '[class$="assetPickerContainer"] .MuiPaper-root': {},
  '[class$="assetPickerContainer"] .MuiCardContent-root': {},
  '[class$="amountCardContent"]': {},
  '[class$="chainBadge"]': {},
});
