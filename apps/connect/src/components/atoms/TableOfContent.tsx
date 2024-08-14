import { styled } from "@mui/material";
import { useEffect, useState } from "react";

const TableContainer = styled("div")(({ theme }) => ({
  borderLeft: "1px solid #FFFFFF1A",
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
  fontSize: 14,
  color: "#9C9DBF",
  fontWeight: 500,
  marginLeft: -2,
  "&:hover": {
    color: "white",
    borderLeft: "3px solid white",
    fontWeight: 600,
  },
}));

const Title = styled("p")(() => ({
  color: "#9C9DBF",
  fontSize: 14,
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
    color: "white",
    borderLeft: "3px solid white",
  };
  useEffect(() => {
    const titles = Array.from(document.querySelectorAll("H2"))
      .filter((el) => !!el.children[0].textContent)
      .map((el) => {
        return { title: el.children[0].textContent, active: false, id: el.id };
      });
    setTableOfContent(titles);
  }, []);
  const updateActive = (idx: number) => {
    const newTableOfContent = tableOfContent.map((item, index) => {
      if (index === idx) {
        item.active = true;
        setTimeout(() => {
          //document.querySelector(`#${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          const el = document.querySelector(`#${item.id}`) as HTMLElement;
          window.scroll({ top: el?.offsetTop || 0, behavior: "smooth" });
        }, 100);
      } else {
        item.active = false;
      }
      return item;
    });
    setTableOfContent(newTableOfContent);
  };
  return (
    <div>
      <Title>TABLE OF CONTENTS</Title>
      <TableContainer>
        {tableOfContent.map((item, idx) => (
          <TableItem
            style={item.active ? activeItem : {}}
            key={idx}
            onClick={() => updateActive(idx)}
          >
            {item.title}
          </TableItem>
        ))}
      </TableContainer>
    </div>
  );
}
