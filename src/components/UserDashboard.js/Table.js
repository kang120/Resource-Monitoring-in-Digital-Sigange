import { useTable } from "react-table";

const Table = ({ columns, data }) => {
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
        columns, data
    })

    return (
        <table className="report-table" {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                    data.length == 0 ?
                    <td className="text-center pt-5 pb-5" colSpan={columns.length}>No record found</td> :

                    rows.map(row => {
                        prepareRow(row);

                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default Table;
