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
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';

import { ApiResponse } from '@/types/api-response';
import { User } from '@/types/user';
import { useSelection } from '@/hooks/use-selection';
import { useAxios } from '@/hooks/useAxios';

function noop(): void {
  // do nothing
}

const client = useAxios();

function applyPagination(customers: Customer[], page: number, rowsPerPage: number): Customer[] {
  return customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string;
  createdAt: Date;
}

// NOT NEEDED AS NO PROPS WILL BE BROUGHT IN
interface CustomersTableProps {
  paginatedCustomers?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}

export function CustomersTable({
  // paginatedCustomers = 0,
  //count = 0 -> this is now paginatedCustomers
  // rows = [],
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const [customers, setCustomers] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    const getCustomers = async () => {
      try {
        const res = await client<ApiResponse<User>>('http://localhost:5000/user_company');
        console.log(res);
        setCustomers(res.data);
      } catch (err) {
        if (isAxiosError(err)) {
          // router.replace(paths.auth.signIn);
          console.log(err);
        }
      }
    };
    // checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  const rowIds = React.useMemo(() => {
    return paginatedCustomers.map((customer: Customer) => customer.id);
  }, [customers]);

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
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer: Customer) => {
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
                      <Avatar src={customer.avatar} />
                      <Typography variant="subtitle2">{customer.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {customer.address.city}, {customer.address.state}, {customer.address.country}
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{dayjs(customer.createdAt).format('MMM D, YYYY')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={paginatedCustomers.length}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
