'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, PaginationState, useReactTable } from '@tanstack/react-table';
import { PageMetadata } from '@/types/page-list';

function noop(): void {
  // do nothing
}

// export interface Customer {
//   id: string;
//   avatar: string;
//   name: string;
//   email: string;
//   address: { city: string; state: string; country: string; street: string };
//   phone: string;
//   createdAt: Date;
// }


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  pagination: PaginationState,
  pageMetadata : PageMetadata,
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
}

export function CustomersTable<TData, TValue>({columns, data, pageMetadata, pagination, setPagination}: DataTableProps<TData, TValue>): React.JSX.Element {
  const table = useReactTable({
    data,
    columns,
    state : {
      pagination,
    },
    manualPagination : true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange : setPagination,
  })
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map(header => {
                  return (
                      <TableCell key={header.id}>
                        {header.isPlaceholder ? null :
                        flexRender(header.column.columnDef.header, header.getContext())
                        }
                      </TableCell>
                  )
                })}
              </TableRow>
            ))}
            </TableHead>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map(cell => {
                      return <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    })}
                  </TableRow>
                )
              })
            ): (
              <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />

      {/* TODO: will make this work with server side pagination */}
      <TablePagination
        component="div"
        count={-1}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={pageMetadata.currentPage}
        rowsPerPage={pageMetadata.pageSize}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
