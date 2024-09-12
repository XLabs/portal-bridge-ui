import type { Message } from "../../configs/messages";
import MuiLink from "@mui/material/Link";
import styled from "@mui/material/styles/styled";
import { FONT_SIZE } from "../../theme/portal";

const Link = styled(MuiLink)<{ backgroundColor: string }>(
  ({ theme, backgroundColor }) => ({
    [theme.breakpoints.down("md")]: {
      marginLeft: "0px",
      marginTop: theme.spacing(1),
    },
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 20,
    padding: "6px 12px",
    backgroundColor: "white",
    color: backgroundColor,
    marginLeft: "8px",
    fontSize: FONT_SIZE.XS,
    letterSpacing: "0.08em",
    fontWeight: 600,
    minHeight: "32px",
    minWidth: "fit-content",
    fontFamily: "Poppins",
    wordWrap: "break-word",
  })
);
export default function NewsBarButton({ button }: Pick<Message, "button">) {
  return (
    button && (
      <Link
        href={button.href}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        backgroundColor={button.background}
      >
        {button.label || "TRY IT NOW"}
      </Link>
    )
  );
}
