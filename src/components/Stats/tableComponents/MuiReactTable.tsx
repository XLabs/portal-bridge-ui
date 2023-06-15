import { IconButton } from "@material-ui/core";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {
  AddCircleOutline,
  KeyboardArrowDown,
  KeyboardArrowRight,
  RemoveCircleOutline,
} from "@material-ui/icons";

import {
  useExpanded,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import TablePaginationActions from "./TablePaginationActions";

const stopProp = (e: any) => {
  e.stopPropagation();
};

export type TableProps = {
  columns: any
  data: any
  skipPageReset?: boolean
  initialState?: any
}

const EnhancedTable = ({ columns, data, skipPageReset, initialState = {} }: TableProps) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    rows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
      initialState,
    } as any,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination
  ) as any;

  const handlePageChange = (_: any, newPage: number) => {
    gotoPage(newPage);
  };

  const handleRowsPerPageChange = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  // Render the UI for your table
  return (
    <>
      <TableContainer>
        <MaUTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: any) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <TableCell
                    {...(column.id === "selection"
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                    align={
                      // TODO: better way to get column?
                      columns.find((c: any) => c.Header === column.Header)?.align ||
                      "left"
                    }
                  >
                    {column.id !== "selection" ? (
                      <TableSortLabel
                        active={column.isSorted}
                        // react-table has a unsorted state which is not treated here
                        direction={column.isSortedDesc ? "desc" : "asc"}
                      >
                        {column.render("Header")}
                      </TableSortLabel>
                    ) : (
                      column.render("Header")
                    )}
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span onClick={stopProp}>
                        <IconButton
                          size="small"
                          {...column.getGroupByToggleProps()}
                        >
                          {column.isGrouped ? (
                            <RemoveCircleOutline fontSize="inherit" />
                          ) : (
                            <AddCircleOutline fontSize="inherit" />
                          )}
                        </IconButton>
                      </span>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row: any) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell: any) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        align={cell.column.align || "left"}
                      >
                        {cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <IconButton
                              size="small"
                              {...row.getToggleRowExpandedProps()}
                            >
                              {row.isExpanded ? (
                                <KeyboardArrowDown fontSize="inherit" />
                              ) : (
                                <KeyboardArrowRight fontSize="inherit" />
                              )}
                            </IconButton>{" "}
                            {cell.render("Cell")} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render("Aggregated")
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render("Cell")
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: rows.length }]}
        count={rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        SelectProps={{
          inputProps: { "aria-label": "rows per page" },
          native: true,
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        ActionsComponent={TablePaginationActions}
      />
    </>
  );
};

export default EnhancedTable;
