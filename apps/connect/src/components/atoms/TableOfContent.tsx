import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { COLOR, FONT_SIZE } from "../../theme/portal";

const TableContainer = styled("div")(({ theme }) => ({
  borderLeft: `1px solid ${COLOR.whiteWithTransparency}`,
  width: 320,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const TableItem = styled("div")(() => ({
  paddingLeft: 20,
  marginBottom: 10,
  marginTop: 10,
  cursor: "pointer",
  textTransform: "capitalize",
  fontSize: FONT_SIZE.S,
  color: COLOR.whiteWithTransparency,
  fontWeight: 500,
  marginLeft: -2,
  "&:hover": {
    color: COLOR.white,
    borderLeft: `3px solid ${COLOR.white}`,
    fontWeight: 600,
  },
}));

const Title = styled("p")(() => ({
  color: COLOR.whiteWithTransparency,
  fontSize: FONT_SIZE.S,
  fontWeight: 500,
}));

interface TableItem {
  title: string | null;
  active: boolean;
  id: string;
}
export default function TableOfContent() {
  const [tableOfContent, setTableOfContent] = useState<TableItem[]>([]);
  const activeItem = {
    fontWeight: 600,
    color: COLOR.white,
    borderLeft: `3px solid ${COLOR.white}`,
  };
  useEffect(() => {
    setTableOfContent(
      Array.from(document.querySelectorAll("H2"))
        .filter((el) => !!el.children[0].textContent)
        .map((el) => ({
          title: el.children[0].textContent,
          active: false,
          id: el.id,
        }))
    );
  }, []);

  const updateActive = (idx: number) => {
    setTableOfContent(
      tableOfContent.map((item, index) => ({
        ...item,
        active: index === idx,
      }))
    );
    const el = document.getElementById(`${tableOfContent[idx]?.id}`);
    window.scroll({ top: el?.offsetTop, behavior: "smooth" });
  };
  return (
    <div>
      <Title>TABLE OF CONTENTS</Title>
      <TableContainer>
        {tableOfContent.map((item, idx) => (
          <TableItem
            style={item.active ? activeItem : {}}
            key={item.id}
            onClick={() => updateActive(idx)}
          >
            {item.title}
          </TableItem>
        ))}
      </TableContainer>
    </div>
  );
}
