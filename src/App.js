import "./styles.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import React from "react";
import { useTable, useExpanded, useSortBy, useGlobalFilter } from "react-table";
import { Filter } from "./Filter";

const Table = ({ columns: userColumns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setGlobalFilter,
    prepareRow,
    state: { expanded, globalFilter }
  } = useTable(
    {
      columns: userColumns,
      data
    },
    useGlobalFilter, // Filter input feature
    useSortBy, // Add sorting feature
    useExpanded // Plugin neccessary for our tree grid component
  );

  return (
    <div>
      {/* Add filter field */}
      <Filter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add feature to toggle sorting by clicking the respective table heads
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Function to create table info

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newData = () => {
  // food array
  const food = [
    "pizza",
    "hamburger",
    "steak",
    "Risotto",
    "Salad",
    "Turkey",
    "Gravy",
    "Corn",
    "Hotdog",
    "Chicken"
  ];
  // Spices array
  const spice = [
    "Paprika",
    "Cinnamon",
    "Curry",
    "Cumin",
    "Thyme",
    "Chili",
    "Cloves",
    "Basil",
    "Garlic",
    "Oregano"
  ];
  // Random number between 1-10
  var randNum = Math.floor(Math.random() * 10) + 1;
  // return information
  return {
    food: food[randNum],
    spice: spice[randNum],
    weight: `${Math.floor(Math.random() * 30)}kg`
  };
};

// Define table and sub rows
function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newData(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
      };
    });
  };

  return makeDataLevel();
}

export default function App() {
  const columns = React.useMemo(
    () => [
      {
        // Build expandable columns
        id: "expander", // NB: ID required
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  //  assign sub rows a padding from the side based on their depth from the parent
                  paddingLeft: `${row.depth * 2}rem`
                }
              })}
            >
              {/* drop down icons */}
              {row.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          ) : null
      },
      // names of column headers
      {
        Header: "Food",
        columns: [
          {
            Header: "Food Name",
            accessor: "food"
          },
          {
            Header: "Spices",
            accessor: "spice"
          }
        ]
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Weight(kg)",
            accessor: "weight"
          }
        ]
      }
    ],
    []
  );

  const data = React.useMemo(() => makeData(5, 5, 5), []);

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}
