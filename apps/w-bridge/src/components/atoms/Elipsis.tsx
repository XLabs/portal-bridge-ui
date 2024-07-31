import styled from "@mui/material/styles/styled";

export type ElipsisProps = {
  width: number;
  height: number;
  marginTop: number;
  marginLeft: number;
};

const Elipsis = styled("div")<ElipsisProps>(
  ({ width, height, marginTop, marginLeft }) => ({
    width,
    height,
    borderColor: "rgb(255, 255, 255, 0.5)",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderRadius: "50%",
    marginTop: marginTop,
    marginLeft: marginLeft,
  })
);

export default Elipsis;
