// import '@mantine/core/styles.css';
// import '@mantine/dates/styles.css'; //if using mantine date picker features
// import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
// import { useMemo } from 'react';
// import {
//     MantineReactTable,
//     useMantineReactTable,
//     type MRT_ColumnDef, MRT_Row,
// } from 'mantine-react-table';
// import { citiesList, data, usStateList, type Person } from './make-data';
// import { Box, Button } from '@mantine/core';
// import { IconDownload } from '@tabler/icons-react';
// import { mkConfig, generateCsv, download } from "export-to-csv";
//
// const ReportTable = () => {
//     const columns = useMemo<MRT_ColumnDef<Person>[]>(
//         () => [
//             {
//                 accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'), //must be strings
//                 id: 'isActive',
//                 header: 'Account Status',
//                 filterVariant: 'checkbox',
//                 Cell: ({ cell }) =>
//                     cell.getValue() === 'true' ? 'Active' : 'Inactive',
//                 size: 220,
//             },
//             {
//                 accessorKey: 'name',
//                 header: 'Name',
//                 filterVariant: 'text', // default
//             },
//             {
//                 accessorFn: (originalRow) => new Date(originalRow.hireDate), //convert to date for sorting and filtering
//                 id: 'hireDate',
//                 header: 'Hire Date',
//                 filterVariant: 'date-range',
//                 Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), // convert back to string for display
//             },
//             {
//                 accessorKey: 'age',
//                 header: 'Age',
//                 filterVariant: 'range',
//                 filterFn: 'between',
//                 size: 80,
//             },
//             {
//                 accessorKey: 'salary',
//                 header: 'Salary',
//                 Cell: ({ cell }) =>
//                     cell.getValue<number>().toLocaleString('en-US', {
//                         style: 'currency',
//                         currency: 'USD',
//                     }),
//                 filterVariant: 'range-slider',
//                 filterFn: 'betweenInclusive', // default (or between)
//                 mantineFilterRangeSliderProps: {
//                     max: 200_000, //custom max (as opposed to faceted max)
//                     min: 30_000, //custom min (as opposed to faceted min)
//                     step: 10_000,
//                     label: (value) =>
//                         value.toLocaleString('en-US', {
//                             style: 'currency',
//                             currency: 'USD',
//                         }),
//                 },
//             },
//             {
//                 accessorKey: 'city',
//                 header: 'City',
//                 filterVariant: 'select',
//                 mantineFilterSelectProps: {
//                     data: citiesList as any,
//                 },
//             },
//             {
//                 accessorKey: 'state',
//                 header: 'State',
//                 filterVariant: 'multi-select',
//                 mantineFilterMultiSelectProps: {
//                     data: usStateList as any,
//                 },
//             },
//         ],
//         [],
//     );
//
//     const handleExportRows = (rows: MRT_Row<Person>[]) => {
//         const rowData = rows.map((row) => row.original);
//         const csv = generateCsv(csvConfig)(rowData);
//         download(csvConfig)(csv);
//     };
//
//     const handleExportData = () => {
//         const csv = generateCsv(csvConfig)(data);
//         download(csvConfig)(csv);
//     };
//
//
//
//     return (
//         <MantineReactTable
//             columns={columns}
//             data={data}
//             enableRowSelection
//             columnFilterDisplayMode="popover"
//             paginationDisplayMode="pages"
//             positionToolbarAlertBanner="bottom"
//             className="bg-cyan-500"
//             renderTopToolbarCustomActions={({ table }) => (
//                 <Box
//                     style={{
//                         display: 'flex',
//                         gap: '16px',
//                         padding: '8px',
//                         flexWrap: 'wrap',
//                     }}
//                 >
//                     <Button
//                         color="lightblue"
//                         //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
//                         onClick={handleExportData}
//                         leftSection={<IconDownload />}
//                         variant="filled"
//                     >
//                         Export All Data
//                     </Button>
//                     <Button
//                         disabled={table.getPrePaginationRowModel().rows.length === 0}
//                         //export all rows, including from the next page, (still respects filtering and sorting)
//                         onClick={() =>
//                             handleExportRows(table.getPrePaginationRowModel().rows)
//                         }
//                         leftSection={<IconDownload />}
//                         variant="filled"
//                     >
//                         Export All Rows
//                     </Button>
//                     <Button
//                         disabled={table.getRowModel().rows.length === 0}
//                         //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
//                         onClick={() => handleExportRows(table.getRowModel().rows)}
//                         leftSection={<IconDownload />}
//                         variant="filled"
//                     >
//                         Export Page Rows
//                     </Button>
//                     <Button
//                         disabled={
//                             !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
//                         }
//                         //only export selected rows
//                         onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
//                         leftSection={<IconDownload />}
//                         variant="filled"
//                     >
//                         Export Selected Rows
//                     </Button>
//                 </Box>
//             )}
//         />
//     );
// };
//
// export default ReportTable;