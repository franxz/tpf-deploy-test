import { useMemo, useState } from "react";
import { useFilters, useSortBy, useTable } from "react-table";
import sty from "./table.module.scss";

type TableProps = {
  data: {
    nombre: string;
    ccSaldo: string;
    factImpCant: number;
    factimpFecha: string;
  }[];
  handleClientClick: (clientId: number) => void;
};

export function Table({ data, handleClientClick }: TableProps) {
  const memoData = useMemo(() => data, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Cliente",
        accessor: "nombre", // accessor is the "key" in the data
      },
      {
        Header: "Saldo Cta. Cte.",
        accessor: "ccSaldo",
      },
      {
        Header: "Cant. facturas impagas",
        accessor: "factImpCant",
      },
      {
        Header: "Fecha primer factura impaga",
        accessor: "factimpFecha",
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: memoData },
    useFilters,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = tableInstance;

  const [filterInput, setFilterInput] = useState("");
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter("nombre", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
    setFilterInput(value);
  };

  return (
    <>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder={"Buscar por nombre"}
      />
      <table {...getTableProps()} className={sty.table}>
        <thead>
          {
            // Loop over the header rows

            headerGroups.map((headerGroup) => (
              // Apply the header row props

              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row

                  headerGroup.headers.map((column) => (
                    // Apply the header cell props

                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={
                        column.isSorted
                          ? column.isSortedDesc
                            ? sty.sortDesc
                            : sty.sortAsc
                          : sty.sortDefault
                      }
                    >
                      {
                        // Render the header

                        column.render("Header")
                      }
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

                <tr
                  {...row.getRowProps()}
                  onClick={() => handleClientClick(row.original.id)}
                >
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
    </>
  );
}
