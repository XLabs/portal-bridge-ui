import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: "48px",
    padding: "4px 16px",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "14px",
    letterSpacing: "0.02em",
    background: "linear-gradient(20deg, #f44b1b 0%, #eeb430 100%);",
  },
}));

type Props = {
  children: React.ReactNode;
};

const NewsBar = ({ children }: Props) => {
  const classes = useStyles();

  return <div className={classes.bar}>{children}</div>;
};

export default NewsBar;
