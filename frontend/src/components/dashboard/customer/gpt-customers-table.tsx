import * as React from 'react';
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
import { isAxiosError } from 'axios';

import { ApiResponse } from '@/types/api-response';
import { useSelection } from '@/hooks/use-selection';
import { useAxios } from '@/hooks/useAxios';

function noop(): void {
  // do nothing
}

function applyPagination(customers: Customer[], page: number, rowsPerPage: number): Customer[] {
  return customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

interface CustomersTableProps {
  paginatedCustomers?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}

interface Customer {
  id: string;
  name: string;
  address: string;
  zip_code: string;
  city: string;
  state: string;
  website: string;
  phone_number: string;
  customers: { id: string }[];
  _count: { customers: number };
}

// interface ApiResponseData {
//   message: string;
//   data: Customer[];
// }

export function GPTCustomersTable({ page = 0, rowsPerPage = 10 }: CustomersTableProps): React.JSX.Element {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const client = useAxios(); // Ensure useAxios is called at the top level of the functional component

  React.useEffect(() => {
    const getCustomers = async () => {
      try {
        const res = await client.get<ApiResponse<Customer[]>>('http://localhost:5000/user_company');

        const customersData: Customer[] = res.data.data.map((customerCompany) => ({
          id: customerCompany.id,
          name: customerCompany.name,
          email: '', // Assuming no email in the response, you can adjust this if needed
          address: customerCompany.address,
          city: customerCompany.city,
          state: customerCompany.state,
          zip_code: customerCompany.zip_code,
          phone_number: customerCompany.phone_number.toString(),
          website: customerCompany.website,
          customers: customerCompany.customers,
          _count: customerCompany._count,
          createdAt: new Date(), // Assuming current date as createdAt, adjust if needed
        }));
        console.log(customersData);

        setCustomers(customersData);
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err);
        }
      }
    };
    getCustomers();
  }, [client]);

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  const rowIds = React.useMemo(() => {
    return paginatedCustomers.map((customer: Customer) => customer.id);
  }, [paginatedCustomers]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < customers.length;
  const selectedAll = customers.length > 0 && selected?.size === customers.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer: Customer) => {
              const isSelected = selected?.has(customer.id);

              return (
                <TableRow hover key={customer.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(customer.id);
                        } else {
                          deselectOne(customer.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography variant="subtitle2">{customer.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>
                    {customer.address}, {customer.state}
                  </TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
