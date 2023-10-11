import {
    Theme,
    OPACITY
} from "@wormhole-foundation/wormhole-connect";
import lightblue from "@mui/material/colors/lightBlue";
import grey from "@mui/material/colors/grey";
import green from "@mui/material/colors/green";
import orange from "@mui/material/colors/orange";
import red from "@mui/material/colors/red";

const customized: Theme = {
    divider: "#ffffff" + OPACITY[20],
    background: {
        default: "transparent",
    },
    text: {
        primary: "#ffffff",
        secondary: grey[500],
    },
    button: {
        primary: "#ffffff19",
        primaryText: "#ffffff",
        disabled: "#ffffff0F",
        disabledText: "#ffffff66",
        action: "#ffffff",
        actionText: "#17153F",
        hover: "#ffffff0F",
    },
    font: {
        primary: "Poppins, sans-serif",
        header: "Suisse BP Intl, sans-serif",
    },
    options: {
        hover: "rgb(15, 16, 36);",
        select: "#5b5b5b",
    },
    card: {
        background: "rgba(255, 255, 255, 0.047);",
        secondary: "rgba(255, 255, 255, 0.047);",
        elevation: "none",
    },
    popover: {
        background: "#1b2033",
        secondary: "#ffffff" + OPACITY[5],
        elevation: "none",
    },
    modal: {
        background: "rgb(15, 16, 36, 0.95);",
    },
    primary: grey,
    secondary: grey,
    error: red,
    info: lightblue,
    success: green,
    warning: orange,
};

export default customized;