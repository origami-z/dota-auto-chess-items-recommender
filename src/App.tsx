import { useMemo } from "react";
import itemsDataCN from "./items/items_auto_chess_zh-CN.json";
import { useTable, useSortBy } from "react-table";

import "./App.css";

interface DACItem {
  localized_name: string;
  localized_name_zh: string;
  name: string;
  url_image: string;
  id: number;
  tier: number;
}

function ColoredNameCell(cell: any) {
  const item = cell.row.original as DACItem;
  return <span className={`tier${item.tier}`}>{cell.value}</span>;
}

function App() {
  const itemsData = useMemo<Array<{ [prop: string]: any }>>(
    () => itemsDataCN,
    []
  );
  const idToImageMap = useMemo(() => {
    const idImageMap = new Map();
    itemsData.forEach((item) => idImageMap.set(item.id, item.url_image));
    return idImageMap;
  }, [itemsData]);
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Tier", accessor: "tier" },
      {
        Header: "Name",
        accessor: "localized_name",
        Cell: ColoredNameCell,
      },
      {
        Header: "物品",
        accessor: "localized_name_zh",
        Cell: ColoredNameCell,
      },
      {
        Header: "图片",
        accessor: "url_image",
        Cell: ({ row }: any) => {
          const item = row.original as DACItem;
          return (
            <img
              className="image"
              src={item.url_image}
              alt={item.localized_name + "_image"}
            />
          );
        },
      },
      {
        Header: "配方",
        accessor: "recipe",
        Cell: (cellProps) => {
          const { value } = cellProps;
          return (
            value &&
            value.length > 0 && (
              <>
                👉
                {value.map((id: number) => (
                  <img
                    className="image"
                    src={idToImageMap.get(id)}
                    alt={id + "_id_image"}
                  />
                ))}
              </>
            )
          );
        },
      },
    ],
    [idToImageMap]
  );
  const tableInstance = useTable({ columns, data: itemsData }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className="App">
      <h1>Dota Auto Chess Items</h1>
      <table {...getTableProps()}>
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column: any) => (
                    // Add the sorting props to control sorting. For this example
                    // we can add them into the header props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td {...cell.getCellProps()}>
                          {
                            // Render the cell contents
                            cell.render("Cell")
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
